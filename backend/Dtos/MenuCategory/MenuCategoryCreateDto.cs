using backend.Models;
using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.MenuCategory
{
    public class MenuCategoryCreateDto
    {
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(50, ErrorMessage = "Name cannot be longer than 50 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "CategoryType is required.")]
        public CategoryType CategoryType { get; set; }
    }
}