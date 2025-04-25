using backend.Models;

namespace backend.Helpers.DataSeeders
{
    public static class MenuItemDataSeeder
    {
        public static List<MenuItem> GetMenuItems(List<MenuCategory> menuCategories)
        {
            var menuItems = new List<MenuItem>();
            for (int i = 0; i < menuCategories.Count; i++)
            {

                for (int j = 0; j < 3; j++)
                {
                    menuItems.Add(new()
                    {
                        Name = $"Menu item {i * 3 + j + 1}",
                        Description = $"Description {i * 3 + j + 1}",
                        Price = 5,
                        MenuCategoryId = menuCategories[i].Id,
                    });
                }
            }

            for (int i = 0; i < menuItems.Count; i++)
            {
                menuItems[i].Id = i + 1;
            }

            return menuItems;
        }
    }
}
