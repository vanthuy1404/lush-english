using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class ChattingExerciseController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ChattingExerciseController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ChattingExercise>>> GetAll()
    {
        var exercises = await _context.ChattingExercise.ToListAsync();
        return Ok(exercises);
    }

 
    [HttpGet("{id}")]
    public async Task<ActionResult<ChattingExercise>> GetById(Guid id)
    {
        var exercise = await _context.ChattingExercise.FindAsync(id);

        if (exercise == null)
        {
            return NotFound(new { message = "Exercise not found" });
        }

        return Ok(exercise);
    }
}
