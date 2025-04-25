using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.User
{
    public class ResendTwoFactorDto
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public required string Email { get; set; }
    }
}