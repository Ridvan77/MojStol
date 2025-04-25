using backend.Dtos.MenuCategory;
using backend.Models;

namespace backend.Mappers
{
    public static class MenuCategoryMapper
    {
        public static MenuCategoryDto ToMenuCategoryDto(this MenuCategory menuCategoryModel)
        {
            return new()
            {
                Id = menuCategoryModel.Id,
                Name = menuCategoryModel.Name,
                CategoryType = menuCategoryModel.CategoryType
            };
        }

        public static MenuCategory ToMenuCategoryFromCreate(this MenuCategoryCreateDto menuCategoryDto, int restuaurantId)
        {
            return new()
            {
                Name = menuCategoryDto.Name.Trim(),
                RestaurantId = restuaurantId,
                CategoryType = menuCategoryDto.CategoryType
            };
        }

        public static MenuCategory ToMenuCategoryFromUpdate(this MenuCategoryUpdateDto menuCategoryDto, int restuaurantId)
        {
            return new()
            {
                Name = menuCategoryDto.Name.Trim(),
                RestaurantId = restuaurantId,
                CategoryType = menuCategoryDto.CategoryType
            };
        }
    }
}
