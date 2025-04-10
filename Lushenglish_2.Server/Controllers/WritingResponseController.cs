using Microsoft.AspNetCore.Mvc;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Lushenglish_2.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WritingResponseController : ControllerBase
    {
        private static readonly string apiKey = "AIzaSyBh3sFan30OE6LeWzwbjxwJyBiQHBeXb-4";
        private static readonly string apiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}";
        private readonly ApplicationDbContext _context;

        public WritingResponseController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<WritingResponseDto>> ResponseWriting([FromBody] WritingRequestDto request)
        {
            if (request == null || request.Submit == null || request.Exercise == null)
            {
                return BadRequest("Invalid request data.");
            }

            string prompt =
                "You are a judge grading a writing assignment on a scale of 10.\n" +
                $"## Assignment Information:\n" +
                $"- **Title**: {request.Exercise.ExerciseName}\n" +
                $"- **Requirements**: {request.Exercise.Requirement}\n\n" +
                $"## Grading Criteria:\n" +
                $"1. Identify mistakes in the writing.\n" +
                $"2. Correct the mistakes to meet the requirements.\n" +
                $"3. Grade the writing based on the following criteria:\n" +
                $"   - Grammar & Vocabulary (3 points)\n" +
                $"   - Coherence & Flow (3 points)\n" +
                $"   - Requirement Fulfillment (4 points)\n\n" +
                $"Return the result in the following JSON format:\n\n" +
                $"{{\n  \"feedback\": \"Detailed feedback...\",\n  \"corrected_letter\": \"The letter after fixing...\",\n  \"score\": 8\n}}\n\n" +
                $"User's writing:\n\"{request.Submit}\"";

            var requestBody = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = prompt } } }
                }
            };

            using (HttpClient client = new HttpClient())
            {
                string jsonRequest = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");
                var response = await client.PostAsync(apiUrl, content);
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
                        var jsonText = root
                            .GetProperty("candidates")[0]
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
                            var feedback = parsedDoc.RootElement.GetProperty("feedback").GetString();
                            var correctedLetter = parsedDoc.RootElement.GetProperty("corrected_letter").GetString();
                            var score = parsedDoc.RootElement.GetProperty("score").GetInt32();

                            return Ok(new WritingResponseDto
                            {
                                Feedback = feedback,
                                CorrectLetter = correctedLetter,
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

    public class WritingRequestDto
    {
        public string Submit { get; set; }
        public WritingExercise Exercise { get; set; }
    }

   
  

    public class WritingResponseDto
    {
        public string Feedback { get; set; }
        public string CorrectLetter { get; set; }
        public int Score { get; set; }
    }
}
