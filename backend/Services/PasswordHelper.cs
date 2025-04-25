using System.Security.Cryptography;
using System.Text;

namespace Services {
  public class PasswordHelper {
    private
    const int SaltSize = 128;

    public(string passwordHash, string passwordSalt) CreatePasswordHash(string password) {
      byte[] salt = new byte[SaltSize / 8];
      RandomNumberGenerator.Fill(salt);

      using(var hmac = new HMACSHA512(salt)) {
        var passwordHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
        var passwordSalt = Convert.ToBase64String(salt); 
        return (passwordHash, passwordSalt);
      }
    }

    public bool VerifyPasswordHash(string password, string storedHash, string storedSalt) {
      if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(storedHash) || string.IsNullOrEmpty(storedSalt)) {
        throw new ArgumentException("Password, stored hash, or stored salt cannot be null or empty.");
      }
      byte[] salt = Convert.FromBase64String(storedSalt);

      using(var hmac = new HMACSHA512(salt)) {
        var computedHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
        return computedHash == storedHash;
      }
    }

  }
}