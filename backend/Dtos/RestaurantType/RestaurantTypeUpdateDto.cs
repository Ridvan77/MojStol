using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.RestaurantType
{
    public class RestaurantTypeUpdateDto
    {
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(50, ErrorMessage = "Name cannot be longer than 50 characters.")]
        public string Name { get; set; } = string.Empty;
    }
}