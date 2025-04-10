using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UsersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    // GET: api/Users/5
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound($"User with ID {id} not found.");
        }
        return user;
    }

    // POST: api/Users
    [HttpPost]
    public async Task<ActionResult<User>> PostUser(User user)
    {
        // Kiểm tra email đã tồn tại
        if (await CheckExistByEmail(user.Email))
        {
            return BadRequest($"Email {user.Email} is already in use.");
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUser), new { id = user.UserID }, user);
    }
    [HttpGet("info")]
    [Authorize] // Chỉ cho phép người dùng có AccessToken hợp lệ truy cập
    public async Task<IActionResult> GetUserInfo()
    {
        try
        {
            // Lấy email từ JWT
            var email = GetEmailFromJwt(HttpContext);

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized("Invalid token claims");
            }

            // Tìm kiếm người dùng trong cơ sở dữ liệu
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return NotFound("No user");
            }

            // Trả về thông tin người dùng
            return Ok(new
            {
                User = user
            });
        }
        catch (SecurityTokenException)
        {
            return Unauthorized("Invalid access token");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
    // PUT: api/Users/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutUser(int id, User user)
    {
        if (id != user.UserID)
        {
            return BadRequest("ID in URL does not match with UserID.");
        }

        _context.Entry(user).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await CheckExistByID(id))
            {
                return NotFound($"User with ID {id} not found.");
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/Users/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound($"User with ID {id} not found.");
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<bool> CheckExistByID(int id)
    {
        return await _context.Users.AnyAsync(u => u.UserID == id);
    }

    private async Task<bool> CheckExistByEmail(string email)
    {
        return await _context.Users.AnyAsync(u => u.Email == email);
    }
    private string? GetEmailFromJwt(HttpContext? context)
    {
        if (context == null)
        {
            return null;
        }

        var emailUser = context.User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;


        return emailUser == null ? null : emailUser;
    }
}
