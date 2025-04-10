using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace EnglishLearning.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VocabulariesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VocabulariesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Vocabularies
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vocabulary>>> GetVocabularies()
        {
            return await _context.Vocabularies.ToListAsync();
        }

        // GET: api/Vocabularies/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Vocabulary>> GetVocabulary(Guid id)
        {
            var vocabulary = await _context.Vocabularies.FindAsync(id);

            if (vocabulary == null)
            {
                return NotFound();
            }

            return vocabulary;
        }

        // GET: api/Vocabularies/topic/{topicId}
        [HttpGet("topic/{topicId}")]
        public async Task<ActionResult<IEnumerable<Vocabulary>>> GetVocabulariesByTopic(Guid topicId)
        {
            var vocabularies = await _context.Vocabularies
                                              .Where(v => v.TopicID == topicId)
                                              .ToListAsync();

            if (!vocabularies.Any())
            {
                return NotFound();
            }

            return vocabularies;
        }

        // POST: api/Vocabularies
        [HttpPost]
        public async Task<ActionResult<Vocabulary>> PostVocabulary(Vocabulary vocabulary)
        {
            vocabulary.VocabularyID = Guid.NewGuid(); // Generate a new GUID for VocabularyID
            _context.Vocabularies.Add(vocabulary);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVocabulary), new { id = vocabulary.VocabularyID }, vocabulary);
        }

        // PUT: api/Vocabularies/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVocabulary(Guid id, Vocabulary vocabulary)
        {
            if (id != vocabulary.VocabularyID)
            {
                return BadRequest();
            }

            _context.Entry(vocabulary).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Vocabularies/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVocabulary(Guid id)
        {
            var vocabulary = await _context.Vocabularies.FindAsync(id);
            if (vocabulary == null)
            {
                return NotFound();
            }

            _context.Vocabularies.Remove(vocabulary);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

}
