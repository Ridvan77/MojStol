using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.MenuItem
{
    public class MenuItemCreateDto
    {
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(50, ErrorMessage = "Name cannot be longer than 50 characters.")]
        public string Name { get; set; } = string.Empty;

        // Description is optional, no validation annotation required.
        [StringLength(255, ErrorMessage = "Description cannot be longer than 255 characters.")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Price is required.")]
        [Range(0.1, double.MaxValue, ErrorMessage = "Price must be greater than zero.")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Menu Category ID is required.")]
        public int MenuCategoryId { get; set; }
    }
}