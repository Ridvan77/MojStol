using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.RestaurantImage
{
    public class RestaurantImageCreateDto
    {
        [Required(ErrorMessage = "Base64 image is required.")]
        public string Base64Image { get; set; } = default!;
    }
}