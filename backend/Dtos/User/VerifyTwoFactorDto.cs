using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.User
{
    public class VerifyTwoFactorDto
    {
        [Required(ErrorMessage = "UserId is required.")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "You must enter the code.")]
        public required string TwoFactorCode { get; set; }
    }
}
