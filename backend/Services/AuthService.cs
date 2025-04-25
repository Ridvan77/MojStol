using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.Dtos.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using backend.Models;
using backend.Interfaces;
using backend.Data;
using Services;

namespace Services {
  public class AuthService: IAuthService {
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly TokenService _tokenService;
    private readonly PasswordHelper _passwordHelper;
    private readonly EmailService2 _emailService2;

    public AuthService(ApplicationDbContext context, IConfiguration configuration, TokenService tokenService, EmailService2 emailService2) {
      _context = context;
      _configuration = configuration;
      _tokenService = tokenService;
      _passwordHelper = new PasswordHelper();
      _emailService2 = emailService2;
    }

        public async Task<string> Register(UserRegisterDto request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Password))
                {
                    return "Password cannot be null or empty.";
                }

                // Check if the selected role is valid (either User or Owner)
                //if (request.RoleId != 2 && request.RoleId != 3)
                //{
                //    return "Invalid role selected. Only 'User' or 'Owner' roles are allowed.";
                //}

                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (existingUser != null)
                {
                    return "A user with this email already exists.";
                }

                // Fetch the role based on the provided RoleId (User or Owner)
                var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleID == request.RoleId);
                if (role == null)
                {
                    return "Invalid role selected.";
                }

                var (passwordHash, passwordSalt) = _passwordHelper.CreatePasswordHash(request.Password);

                var user = new User
                {
                    Name = request.Name,
                    Surname = request.Surname,
                    Email = request.Email,
                    PasswordHash = passwordHash,
                    PasswordSalt = passwordSalt,
                    RoleId = role.RoleID,
                    Role = role,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return "User registered successfully.";
            }
            catch (DbUpdateException dbEx)
            {
                var innerException = dbEx.InnerException?.Message;

                if (innerException != null && innerException.Contains("duplicate key"))
                {
                    return "A user with this email already exists.";
                }

                return $"An unexpected error occurred: {dbEx.Message}";
            }
            catch (Exception ex)
            {
                return $"An unexpected error occurred: {ex.Message}";
            }
        }





        public async Task<(int UserId, string Message)> Login(UserLoginDto request)
{
    if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
    {
        throw new ArgumentException("Email and password cannot be null or empty.");
    }
    var user = await GetUserByEmail(request.Email);
    
    if (user == null || string.IsNullOrEmpty(user.PasswordHash) || string.IsNullOrEmpty(user.PasswordSalt))
    {
        throw new Exception("Invalid email or password.");
    }
    if (!_passwordHelper.VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
    {
        throw new Exception("Invalid email or password.");
    }

    var twoFactorCode = GenerateTwoFactorCode();
    user.TwoFactorCode = twoFactorCode;
    user.TwoFactorExpiration = DateTime.UtcNow.AddMinutes(10);

    user.TwoFactorEnabled = true;

    await _context.SaveChangesAsync();

    var emailSubject = "Your Two-Factor Authentication Code";
    var emailBody = $"Your authentication code is: {twoFactorCode}";
    _emailService2.Send(user.Email, emailSubject, emailBody);

    return (user.UserId, "2FA code sent. Please check your email.");
}




public async Task<string> VerifyTwoFactorCode(int userId, string twoFactorCode)
{
  var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserId == userId);

    if (user == null)
    {
        throw new Exception("User not found.");
    }

    Console.WriteLine($"User ID: {user.UserId}, Role ID: {user.Role?.RoleID}, Role Name: {user.Role?.Name}");


    if (user.Role == null)
    {
        throw new Exception("Role is missing.");
    }


    if (user.TwoFactorCode != twoFactorCode || user.TwoFactorExpiration < DateTime.UtcNow)
    {
        throw new Exception("Invalid or expired two-factor authentication code.");
    }

    user.TwoFactorCode = null;
    user.TwoFactorExpiration = null;
    await _context.SaveChangesAsync();

    return _tokenService.CreateToken(user);
}



    public async Task < string > ResendTwoFactorCode(string email) {
      var user = await GetUserByEmail(email);

      if (!user.TwoFactorEnabled) {
        throw new Exception("Two-factor authentication is not enabled for this user.");
      }

      var twoFactorCode = GenerateTwoFactorCode();
      user.TwoFactorCode = twoFactorCode;
      user.TwoFactorExpiration = DateTime.UtcNow.AddMinutes(10);
      await _context.SaveChangesAsync();

      var emailSubject = "Your Two-Factor Authentication Code (Resend)";
      var emailBody = $"Your new authentication code is: {twoFactorCode}";
      _emailService2.Send(user.Email, emailSubject, emailBody);

      return "New 2FA code sent. Please check your email.";
    }

    public async Task < string > ForgotPassword(string email) {
      var user = await GetUserByEmail(email);

      if (user == null)
        throw new Exception("User not found.");

      var token = Guid.NewGuid().ToString();
      user.ResetToken = token;
      user.TokenExpires = DateTime.UtcNow.AddMinutes(10);

      await _context.SaveChangesAsync();

      //Prebaciti u .env 
      var resetLink = $"http://localhost:4200/reset-password?token={token}";
      var emailSubject = "Reset Your Password";
      var emailBody = $"Reset your password using this link: {resetLink}";
      _emailService2.Send(user.Email, emailSubject, emailBody);

      return "Reset link sent to your email.";
    }

    public async Task < string > ResetPassword(string token, string newPassword) {
      var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.ResetToken == token);

      if (user == null) {
        throw new Exception("User or role is missing.");
      }

      if (user.TokenExpires < DateTime.UtcNow) {
        throw new Exception("Reset token has expired.");
      }

      var (passwordHash, passwordSalt) = _passwordHelper.CreatePasswordHash(newPassword);
      user.PasswordHash = passwordHash;
      user.PasswordSalt = passwordSalt;

      user.ResetToken = null;
      user.TokenExpires = null;

      await _context.SaveChangesAsync();

      var authToken = _tokenService.CreateToken(user);

      return authToken;
    }

    public async Task < User > GetUserByEmail(string email) {
      var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == email);
      if (user == null) {
        throw new InvalidOperationException("User not found.");
      }
      return user;
    }

    private string GenerateTwoFactorCode() {
      var bytes = new byte[4];
      RandomNumberGenerator.Fill(bytes);
      int randomValue = Math.Abs(BitConverter.ToInt32(bytes, 0)) % 1000000;
      return randomValue.ToString("D6");
    }
  }
}