using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Lushenglish_2.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChattingResponseController : ControllerBase
    {
        private static readonly string _apiKey = "AIzaSyBh3sFan30OE6LeWzwbjxwJyBiQHBeXb-4";
        private static readonly string _apiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={_apiKey}";
        private readonly ApplicationDbContext _context;
        public ChattingResponseController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<ChattingResponseDto>> GetChatResponse([FromBody] ChattingRequestDto request)
        {

            if (request == null || request.ChatMessages == null || request.ChatMessages.Count == 0)
            {
                return BadRequest("Invalid request data.");
            }
            var chattingExercise = await _context.ChattingExercise.FindAsync(request.ChattingExerciseID);

            var prompt = new StringBuilder();

            prompt.AppendLine($"You are playing the role of a **{chattingExercise.AiRole}**.");
            prompt.AppendLine($"## Scenario: {chattingExercise.ChattingExerciseName}");
            prompt.AppendLine($"- **Objective**: {chattingExercise.Objective}");
            prompt.AppendLine($"- **Requirement**: {chattingExercise.Requirement}");
            prompt.AppendLine();

            prompt.AppendLine("## Instructions:");
            prompt.AppendLine("1. Reply naturally in the role of the given AI persona.");
            prompt.AppendLine("2. Ensure responses are grammatically correct with subtle corrections if needed.");
            prompt.AppendLine("3. Keep the conversation relevant and within the given context.");
            prompt.AppendLine($"4. Try to complete the conversation within {chattingExercise.MaxAiReplies} messages.");
            prompt.AppendLine("5. Respond in the following JSON format:\n");

            prompt.AppendLine("```json");
            prompt.AppendLine("{");
            prompt.AppendLine("  \"response\": \"your AI-generated response\",");
            prompt.AppendLine("  \"yourevaluation\": \"a short detailed evaluation of the conversation. Point out errors on user responses. Maybe give some better alternative sentences so users can study\",");
            prompt.AppendLine("  \"score\": an integer score from 1 to 10.");
            prompt.AppendLine("}");
            prompt.AppendLine("```");
            prompt.AppendLine();

            prompt.AppendLine("### Chat History:");
            foreach (var message in request.ChatMessages)
            {
                prompt.AppendLine($"- **{message.Role}**: {message.Content}");
            }

            var requestBody = new
            {
                contents = new[]
                {
        new
        {
            parts = new[] { new { text = prompt.ToString() } }
        }
    }
            };

            using (HttpClient client = new HttpClient())
            {
                string jsonRequest = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");
                var response = await client.PostAsync(_apiUrl, content);
                string jsonResponse = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, $"API error: {jsonResponse}");
                }
                try
                {
                    using (JsonDocument doc = JsonDocument.Parse(jsonResponse))
                    {
                        var root = doc.RootElement;
                        if (!root.TryGetProperty("candidates", out var candidates) || candidates.GetArrayLength() == 0)
                        {
                            return BadRequest("Invalid AI response format.");
                        }

                        var jsonText = candidates[0]
                            .GetProperty("content")
                            .GetProperty("parts")[0]
                            .GetProperty("text")
                            .GetString();

                        if (string.IsNullOrWhiteSpace(jsonText))
                        {
                            return BadRequest("Invalid AI response format.");
                        }

                        jsonText = jsonText.Replace("```json", "").Replace("```", "").Trim();

                        using (JsonDocument parsedDoc = JsonDocument.Parse(jsonText))
                        {
                            var parsedRoot = parsedDoc.RootElement;

                            if (!parsedRoot.TryGetProperty("response", out var responseProp) ||
                                !parsedRoot.TryGetProperty("yourevaluation", out var evalProp) ||
                                !parsedRoot.TryGetProperty("score", out var scoreProp))
                            {
                                return BadRequest("Missing required properties in AI response.");
                            }

                            var responseText = responseProp.GetString();
                            var evaluation = evalProp.GetString();
                            var score = scoreProp.GetInt32();

                            return Ok(new ChattingResponseDto
                            {
                                ReplyMessage = responseText,
                                Evaluation = evaluation,
                                Score = score
                            });
                        }
                    }
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Error parsing JSON: {ex.Message}");
                }
            }
        }
    }

    public class ChattingRequestDto
    {
        [JsonPropertyName("chattingExerciseID")]
        public Guid ChattingExerciseID { get; set; }
        public List<ChatMessage> ChatMessages { get; set; }
    }

    public class ChatMessage
    {
        [JsonPropertyName("role")]
        public string Role { get; set; }

        [JsonPropertyName("content")]
        public string Content { get; set; }
    }

    public class ChattingResponseDto
    {
        [JsonPropertyName("replyMessage")]
        public string ReplyMessage { get; set; }
        public string Evaluation { get; set; }
        public int Score { get; set; }
    }
}
