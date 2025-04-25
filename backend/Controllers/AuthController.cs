using backend.Dtos.User;
using Microsoft.AspNetCore.Mvc;
using backend.Interfaces;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.Register(request);
            
            if (result == "User registered successfully.")
            {
                return Ok(new { Message = result });
            }

            return BadRequest(new { Message = result });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto request)
        {
            try
            {
                var (userId, message) = await _authService.Login(request);
                return Ok(new { UserId = userId, Message = message });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }


        [HttpPost("verify-2fa")]
        public async Task<IActionResult> VerifyTwoFactorCode(VerifyTwoFactorDto request)
        {
            try
            {
                var token = await _authService.VerifyTwoFactorCode(request.UserId, request.TwoFactorCode);
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }



        [HttpPost("resend-2fa")]
        public async Task<IActionResult> ResendTwoFactorCode(ResendTwoFactorDto request)
        {
            try
            {
                var result = await _authService.ResendTwoFactorCode(request.Email);
                return Ok(new { Message = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto request)
        {
            try
            {
                var result = await _authService.ForgotPassword(request.Email);
                return Ok(new { Message = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto request)
        {
            try
            {
                var token = await _authService.ResetPassword(request.Token, request.NewPassword);
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
