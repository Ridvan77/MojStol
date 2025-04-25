using backend.Dtos.MenuItem;
using backend.Models;

namespace backend.Mappers
{
    public static class MenuItemMapper
    {
        public static MenuItemDto ToMenuItemDto(this MenuItem menuItemModel)
        {
            return new()
            {
                Id = menuItemModel.Id,
                Name = menuItemModel.Name,
                Description = menuItemModel.Description,
                Price = menuItemModel.Price,
                MenuCategoryId = menuItemModel.MenuCategoryId
            };
        }

        public static MenuItem ToMenuItemFromCreate(this MenuItemCreateDto menuItemDto)
        {
            return new()
            {
                Name = menuItemDto.Name.Trim(),
                Description = menuItemDto.Description?.Trim(),
                Price = menuItemDto.Price,
                MenuCategoryId = menuItemDto.MenuCategoryId
            };
        }

        public static MenuItem ToMenuItemFromUpdate(this MenuItemUpdateDto menuItemDto)
        {
            return new()
            {
                Name = menuItemDto.Name.Trim(),
                Description = menuItemDto.Description?.Trim(),
                Price = menuItemDto.Price,
                MenuCategoryId = menuItemDto.MenuCategoryId
            };
        }
    }
}
