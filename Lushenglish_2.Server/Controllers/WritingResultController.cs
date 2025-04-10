using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lushenglish_2.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WritingResultController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WritingResultController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("user/{userID}")]
        public async Task<ActionResult<IEnumerable<WritingResult>>> GetWritingResultByUserID(int userID)
        {
            var writingResults = await _context.WritingResult.Where(wr => wr.UserID == userID).ToListAsync();
            if (writingResults == null || writingResults.Count == 0)
            {
                return NotFound("No WritingResult found for this user.");
            }
            return Ok(writingResults);
        }

        [HttpGet("{resultID:guid}")]
        public async Task<ActionResult<WritingResult>> GetWritingResult(Guid resultID)
        {
            var writingResult = await _context.WritingResult.FindAsync(resultID);
            if (writingResult == null)
            {
                return NotFound("No result found.");
            }
            return Ok(writingResult);
        }
        [HttpGet("exercise/{writingExerciseName}/user/{userID}")]
        public async Task<IActionResult> GetWritingResultsByExerciseNameAndUserID(string writingExerciseName, int userID)
        {
            var results = await _context.WritingResult
                .Where(wr => wr.WritingExerciseName == writingExerciseName && wr.UserID == userID)
                .ToListAsync();

            return results.Any() ? Ok(results) : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> AddWritingResult(WritingResult writingResult)
        {
            if (writingResult == null)
            {
                return BadRequest("Invalid data.");
            }

            if (writingResult.ResultID == Guid.Empty)
            {
                writingResult.ResultID = Guid.NewGuid();
            }

            _context.WritingResult.Add(writingResult);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWritingResult), new { resultID = writingResult.ResultID }, writingResult);
        }
        [HttpPut("{resultID:guid}")]
        public async Task<IActionResult> UpdateWritingResult(Guid resultID, WritingResult updatedResult)
        {
            if (updatedResult == null || resultID != updatedResult.ResultID)
            {
                return BadRequest("Invalid request data.");
            }

            var existingResult = await _context.WritingResult.FindAsync(resultID);
            if (existingResult == null)
            {
                return NotFound("WritingResult not found.");
            }

            // Cập nhật dữ liệu
            existingResult.WritingExerciseName = updatedResult.WritingExerciseName;
            existingResult.UserID = updatedResult.UserID;
            existingResult.SubmittedText = updatedResult.SubmittedText;
            existingResult.CorrectedText = updatedResult.CorrectedText;
            existingResult.Score = updatedResult.Score;
            existingResult.Feedback = updatedResult.Feedback;

            _context.Entry(existingResult).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(existingResult);
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "An error occurred while updating the WritingResult.");
            }
        }
    }
}
