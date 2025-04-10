using Lushenglish_2.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/ChattingResult")]
[ApiController]
public class ChattingExerciseResultController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ChattingExerciseResultController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateResult([FromBody] ChattingExerciseResult result)
    {
        if (result == null)
            return BadRequest("Invalid data.");

        result.ChattingResultID = Guid.NewGuid();
        result.CreatedAt = DateTime.UtcNow;

        _context.ChattingExerciseResult.Add(result);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = result.ChattingResultID }, result);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateResult([FromBody] ChattingExerciseResult updatedResult)
    {
        if (updatedResult == null || updatedResult.ChattingResultID == Guid.Empty)
            return BadRequest("Invalid request data.");

        var existingResult = await _context.ChattingExerciseResult.FindAsync(updatedResult.ChattingResultID);
        if (existingResult == null)
            return NotFound();

        existingResult.Score = updatedResult.Score;
        existingResult.Evaluation = updatedResult.Evaluation;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<ChattingExerciseResult>>> GetByUserId(int userId)
    {
        var results = await _context.ChattingExerciseResult
            .Where(r => r.UserID == userId)
            .ToListAsync();

        return Ok(results);
    }

    [HttpGet("ChattingExercise/{chattingExerciseId}")]
    public async Task<ActionResult<IEnumerable<ChattingExerciseResult>>> GetByExerciseId(Guid chattingExerciseId)
    {
        var result = await _context.ChattingExerciseResult
            .Where(r => r.ChattingExerciseID == chattingExerciseId)
            .FirstOrDefaultAsync();

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ChattingExerciseResult>> GetById(Guid id)
    {
        var result = await _context.ChattingExerciseResult.FindAsync(id);
        if (result == null)
            return NotFound();

        return Ok(result);
    }
}
