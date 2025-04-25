using backend.Models;

namespace backend.Dtos.MenuCategory
{
    public class MenuCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public CategoryType CategoryType { get; set; }
    }
}
