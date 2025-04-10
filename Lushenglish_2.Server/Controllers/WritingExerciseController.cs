using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lushenglish_2.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WritingExerciseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WritingExerciseController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/WritingExercise
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WritingExercise>>> GetAllWritingExercises()
        {
            return await _context.WritingExercises.ToListAsync();
        }

        // GET: api/WritingExercise/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<WritingExercise>> GetWritingExerciseByID(Guid id)
        {
            var exercise = await _context.WritingExercises.FindAsync(id);
            if (exercise == null)
            {
                return NotFound();
            }
            return exercise;
        }

        // POST: api/WritingExercise
        [HttpPost]
        public async Task<ActionResult<WritingExercise>> CreateWritingExercise(WritingExercise writingExercise)
        {
            writingExercise.WritingExerciseID = Guid.NewGuid();
            _context.WritingExercises.Add(writingExercise);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetWritingExerciseByID), new { id = writingExercise.WritingExerciseID }, writingExercise);
        }

        // PUT: api/WritingExercise/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWritingExercise(Guid id, WritingExercise writingExercise)
        {
            if (id != writingExercise.WritingExerciseID)
            {
                return BadRequest();
            }

            _context.Entry(writingExercise).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.WritingExercises.Any(e => e.WritingExerciseID == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        // DELETE: api/WritingExercise/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWritingExercise(Guid id)
        {
            var exercise = await _context.WritingExercises.FindAsync(id);
            if (exercise == null)
            {
                return NotFound();
            }

            _context.WritingExercises.Remove(exercise);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
