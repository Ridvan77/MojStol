using backend.Models;
using backend.Dtos.User;

namespace backend.Interfaces
{
    public interface IAuthService
    {
        Task<string> Register(UserRegisterDto request);
        Task<(int UserId, string Message)> Login(UserLoginDto request);

        // 2fa
        Task<string> VerifyTwoFactorCode(int userId, string twoFactorCode);
        Task<string> ResendTwoFactorCode(string email);
        Task<User> GetUserByEmail(string email);


        // Forgot and Reset Password
        Task<string> ForgotPassword(string email);
        Task<string> ResetPassword(string token, string newPassword);
    }
}