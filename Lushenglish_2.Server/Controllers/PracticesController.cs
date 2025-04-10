using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace EnglishLearning.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PracticesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PracticesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Practices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Practice>>> GetPractices()
        {
            return await _context.Practices.ToListAsync();
        }

        // GET: api/Practices/topic/{topicId}
        [HttpGet("topic/{topicId}")]
        public async Task<ActionResult<IEnumerable<Practice>>> GetPracticesByTopicId(Guid topicId)
        {
            var practices = await _context.Practices
                                          .Where(p => p.TopicID == topicId)
                                          .ToListAsync();

            if (practices == null || !practices.Any())
            {
                return NotFound($"No practices found for TopicID: {topicId}");
            }

            return Ok(practices);
        }

        // GET: api/Practices/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Practice>> GetPractice(Guid id)
        {
            var practice = await _context.Practices.FindAsync(id);

            if (practice == null)
            {
                return NotFound();
            }

            return practice;
        }

        // POST: api/Practices
        [HttpPost]
        public async Task<ActionResult<Practice>> PostPractice(Practice practice)
        {
            _context.Practices.Add(practice);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPractice", new { id = practice.PracticeID }, practice);
        }

        // PUT: api/Practices/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPractice(Guid id, Practice practice)
        {
            if (id != practice.PracticeID)
            {
                return BadRequest();
            }

            _context.Entry(practice).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Practices/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePractice(Guid id)
        {
            var practice = await _context.Practices.FindAsync(id);
            if (practice == null)
            {
                return NotFound();
            }

            _context.Practices.Remove(practice);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
