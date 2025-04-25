using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Restaurant
{
    public class RestaurantLogoDto
    {
        [Required(ErrorMessage = "Base64Image is required.")]
        public string Base64Image { get; set; } = string.Empty;
    }
}