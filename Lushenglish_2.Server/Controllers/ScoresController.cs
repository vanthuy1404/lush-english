using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace EnglishLearning.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScoresController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ScoresController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Scores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Score>>> GetScores()
        {
            return await _context.Scores.ToListAsync();
        }

        // GET: api/Scores/practice/{practiceId}
        [HttpGet("practice/{practiceId}")]
        public async Task<ActionResult<IEnumerable<Score>>> GetScoresByPracticeId(Guid practiceId)
        {
            var scores = await _context.Scores
                                       .Where(s => s.PracticeID == practiceId)
                                       .ToListAsync();

            if (scores == null || !scores.Any())
            {
                return NotFound($"No scores found for PracticeID: {practiceId}");
            }

            return Ok(scores);
        }

        // GET: api/Scores/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Score>> GetScore(Guid id)
        {
            var score = await _context.Scores.FindAsync(id);

            if (score == null)
            {
                return NotFound();
            }

            return score;
        }
        // GET: api/Scores/user/{userID}/practice/{practiceID}
        [HttpGet("user/{userID}/practice/{practiceID}")]
        public async Task<ActionResult<Score>> GetScoreByUserAndPractice(int userID, Guid practiceID)
        {
            var score = await _context.Scores
                .FirstOrDefaultAsync(s => s.UserID == userID && s.PracticeID == practiceID);

            if (score == null)
                return NotFound();

            return Ok(score);
        }

        // GET: api/Scores/total/user/{userID}
        [HttpGet("total/user/{userID}")]
        public async Task<ActionResult<int>> GetTotalScoreByUser(int userID)
        {
            var totalScore = await _context.Scores
                .Where(s => s.UserID == userID)
                .Select(s => (int?)s.TotalPoints) // Chuyển đổi sang nullable int để tránh lỗi nếu không có bản ghi
                .SumAsync() ?? 0; // Nếu không có bản ghi, tổng điểm mặc định là 0

            return Ok(totalScore);
        }


        // POST: api/Scores
        [HttpPost]
        public async Task<ActionResult<Score>> PostScore(Score score)
        {
            _context.Scores.Add(score);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetScore", new { id = score.ScoreID }, score);
        }

        // PUT: api/Scores/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutScore(Guid id, Score score)
        {
            if (id != score.ScoreID)
            {
                return BadRequest();
            }

            _context.Entry(score).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScoreExists(id))
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

        // DELETE: api/Scores/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScore(Guid id)
        {
            var score = await _context.Scores.FindAsync(id);
            if (score == null)
            {
                return NotFound();
            }

            _context.Scores.Remove(score);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ScoreExists(Guid id)
        {
            return _context.Scores.Any(e => e.ScoreID == id);
        }
    }
}
