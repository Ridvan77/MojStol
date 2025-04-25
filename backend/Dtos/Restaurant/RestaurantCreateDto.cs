using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Restaurant
{
    public class RestaurantCreateDto
    {
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required.")]
        [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters.")]
        public string Description { get; set; } = string.Empty;

        [RegularExpression(@"^www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(\.[a-zA-Z]{2})?$",
        ErrorMessage = "WebSite must start with 'www.' and have a valid domain.")]
        public string? WebSite { get; set; } // WebSite is not required

        [Required(ErrorMessage = "OwnerId is required.")]
        public int OwnerId { get; set; }

        [Required(ErrorMessage = "CityId is required.")]
        public int CityId { get; set; }

        [Required(ErrorMessage = "RestaurantTypeId is required.")]
        public int RestaurantTypeId { get; set; }

        [Required(ErrorMessage = "Street is required.")]
        [StringLength(200, ErrorMessage = "Street cannot be longer than 200 characters.")]
        public string Street { get; set; } = string.Empty;

        // Contact number should be a valid phone number (example for basic validation)
        [Required(ErrorMessage = "ContactNumber is required.")]
        [Phone(ErrorMessage = "ContactNumber must be a valid phone number.")]
        public string ContactNumber { get; set; } = string.Empty;

        // Email validation
        [Required(ErrorMessage = "ContactEmail is required.")]
        [EmailAddress(ErrorMessage = "ContactEmail must be a valid email address.")]
        public string ContactEmail { get; set; } = string.Empty;
    }
}