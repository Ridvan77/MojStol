using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.City
{
    public class CityCreateDto
    {
        [Required(ErrorMessage = "City name is required.")]
        [StringLength(50, ErrorMessage = "City name cannot be longer than 50 characters.")]
        public string Name { get; set; } = string.Empty;
    }
}