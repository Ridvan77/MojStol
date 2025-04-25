using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    [Table("Users")]
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required(ErrorMessage = "User must have a name.")]
        public required string Name { get; set; }

        [Required(ErrorMessage = "User must have a surname.")]
        public required string Surname { get; set; }

        [Required(ErrorMessage = "User must have an email.")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public required string Email { get; set; }

        [JsonIgnore]
        public string ? PasswordHash { get; set; }

        [JsonIgnore]
        public string ? PasswordSalt { get; set; }

        [ForeignKey(nameof(Role))]
        public int RoleId { get; set; }

        [JsonIgnore]
        public Role? Role { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? PhoneNumber { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [JsonIgnore]
        public string? ResetToken { get; set; }

        [JsonIgnore]
        public DateTime? TokenExpires { get; set; }

        [JsonIgnore]
        public string? TwoFactorCode { get; set; }

        [JsonIgnore]
        public DateTime? TwoFactorExpiration { get; set; }

        [JsonIgnore]
        public int? FailedTwoFactorAttempts { get; set; }

        public bool TwoFactorEnabled { get; set; }
        public int BlacklistCounter { get; set; } = 0;
    }
}
