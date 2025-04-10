using System;

public class User
{
    public int UserID { get; set; }          // Primary Key
    public string FullName { get; set; }    // Họ và tên của người dùng
    public string Email { get; set; }       // Địa chỉ email của người dùng
    public string Password { get; set; }    // Mật khẩu
    public bool IsAdmin { get; set; }       //  xác định người dùng có phải Admin hay không
    public DateTime CreatedAt { get; set; } // Ngày tạo tài khoản
    
}
