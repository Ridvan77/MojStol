using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using backend.Models;

namespace Services {
  public class TokenService {
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration) {
      _configuration = configuration;
    }

    public string CreateToken(User user) {
      if (user == null || user.Role == null || string.IsNullOrEmpty(user.Role.Name)) {
        throw new ArgumentException("User or role is missing.");
      }

      var claims = new [] {
        new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
          new Claim(JwtRegisteredClaimNames.Email, user.Email ?? "default@example.com"),
          new Claim(ClaimTypes.Role, user.Role.Name ?? "User"),
          new Claim("Name", user.Name ?? "Unknown"), 
          new Claim("Surname", user.Surname ?? "Unknown")
      };
      
        var jwtKey = "kC4/1P5LlOz1XjsH2F2vQ3bl0hB3aJClfE/ZZQ5FJLo=";
        if (string.IsNullOrEmpty(jwtKey))
        {
                throw new ArgumentNullException("JWT_KEY", "JWT key not found in environment variables.");
        }


      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

      var token = new JwtSecurityToken(
        expires: DateTime.Now.AddDays(1),
        claims: claims,
        signingCredentials: creds
      );

      return new JwtSecurityTokenHandler().WriteToken(token);
    }
  }
}
