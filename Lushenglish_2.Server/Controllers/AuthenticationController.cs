using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;


[ApiController]
[Route("api/[controller]")]
public class AuthenticationController : ControllerBase
{
    public readonly ApplicationDbContext _context;
    public AuthenticationController(ApplicationDbContext context)
    {
        _context = context;
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        Console.WriteLine($"Email: {request.Email}, Password: {request.Password}");
        if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
        {
            return Unauthorized("Email or Password is empty");
        }
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
        {
            return Unauthorized("Wrong email or password");
        }
        if (user.Password != request.Password)
        {
            return Unauthorized("Wrong email or password");
        }

        await _context.SaveChangesAsync();
        return Ok(new
        {
            Message = "Login successfully!",

            userID = user.UserID
        });

    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterInfoRequest request)
    {
        // Kiểm tra tính hợp lệ của dữ liệu yêu cầu
        if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.FullName) || string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.ConfirmPassword))
        {
            return BadRequest("Invalid Request");
        }

        // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp không
        if (request.Password != request.ConfirmPassword)
        {
            return BadRequest("Password doesn't match ConfirmPassword");
        }

        // Kiểm tra xem email đã tồn tại chưa
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (existingUser != null)
        {
            return BadRequest("Email is already in use");
        }

        // Tạo người dùng mới
        var user = new User()
        {
            FullName = request.FullName,
            Email = request.Email,
            Password = request.Password,  // Lưu mật khẩu mà không mã hóa
            IsAdmin = false,
            CreatedAt = DateTime.Now,

        };

        // Thêm người dùng vào cơ sở dữ liệu
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();  // Lưu thay đổi vào cơ sở dữ liệu

        return Ok(new { Message = "Registration successful" });
    }


    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RegisterInfoRequest
    {
        public string FullName { get; set; }    // Họ và tên của người dùng
        public string Email { get; set; }       // Địa chỉ email của người dùng
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}