using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.User
{
    public class UserRegisterDto
    {
        [Required(ErrorMessage = "Name is required")]
        public required string Name { get; set; }
        [Required(ErrorMessage = "Surname is required")]
        public required string Surname { get; set; }
        
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public required string Email { get; set; }

        public required string Password { get; set; }

        [Required(ErrorMessage = "Role is required.")]
        //[Range(2, 3, ErrorMessage = "Role must be either 'User' (2) or 'Owner' (3).")]
        public int RoleId { get; set; }

    }
}