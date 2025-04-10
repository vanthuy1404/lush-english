using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace EnglishLearning.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TopicsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TopicsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/topics
        [HttpGet]
        public async Task<IActionResult> GetTopics()
        {
            var topics = await _context.Topics.ToListAsync();
            return Ok(topics);
        }

        // GET: api/topics/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTopic(Guid id)
        {
            var topic = await _context.Topics.FindAsync(id);

            if (topic == null)
            {
                return NotFound(new { Message = "Topic not found" });
            }

            return Ok(topic);
        }
        //GET: api/topics/findbyName/{topicName}
        [HttpGet("findbyName/{topicName}")]
        public async Task<IActionResult> GetTopicsByName(string topicName)
        {
            if (string.IsNullOrWhiteSpace(topicName))
            {
                return BadRequest(new { Message = "Topic name cannot be empty" });
            }

            var topics = await _context.Topics
                .Where(t => EF.Functions.Like(t.TopicName, $"%{topicName}%")) // Tìm kiếm tương tự LIKE '%topicName%'
                .ToListAsync();

            if (topics == null || topics.Count == 0)
            {
                return NotFound(new { Message = "No related topics found" });
            }

            return Ok(topics);
        }
        // POST: api/topics
        [HttpPost]
        public async Task<IActionResult> CreateTopic([FromBody] Topic topic)
        {
            if (topic == null)
            {
                return BadRequest(new { Message = "Invalid data" });
            }

            topic.TopicID = Guid.NewGuid(); // Generate a new GUID
            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTopic), new { id = topic.TopicID }, topic);
        }

        // PUT: api/topics/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTopic(Guid id, [FromBody] Topic updatedTopic)
        {
            if (id != updatedTopic.TopicID)
            {
                return BadRequest(new { Message = "ID mismatch" });
            }

            var existingTopic = await _context.Topics.FindAsync(id);

            if (existingTopic == null)
            {
                return NotFound(new { Message = "Topic not found" });
            }

            existingTopic.TopicName = updatedTopic.TopicName;
            existingTopic.LinkVideo = updatedTopic.LinkVideo;
            existingTopic.Description = updatedTopic.Description;

            await _context.SaveChangesAsync();
            return Ok(existingTopic);
        }

        // DELETE: api/topics/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTopic(Guid id)
        {
            var topic = await _context.Topics.FindAsync(id);

            if (topic == null)
            {
                return NotFound(new { Message = "Topic not found" });
            }

            _context.Topics.Remove(topic);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
