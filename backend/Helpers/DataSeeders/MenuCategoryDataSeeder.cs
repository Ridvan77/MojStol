using backend.Models;

namespace backend.Helpers.DataSeeders
{
    public static class MenuCategoryDataSeeder
    {
        public static List<MenuCategory> GetMenuCategories(List<Restaurant> restaurants)
        {
            var menuCategories = new List<MenuCategory>();

            for (int i = 0; i < restaurants.Count; i++)
            {
                menuCategories.AddRange(
                [
                    new() { Name = "Senviči", RestaurantId = restaurants[i].Id, CategoryType = CategoryType.Food },
                    new() { Name = "Supe", RestaurantId = restaurants[i].Id, CategoryType = CategoryType.Food },
                    new() { Name = "Tjestenina i rižoto", RestaurantId = restaurants[i].Id, CategoryType = CategoryType.Food },
                    new() { Name = "Salate", RestaurantId = restaurants[i].Id, CategoryType = CategoryType.Food },
                    new() { Name = "Pizze", RestaurantId = restaurants[i].Id, CategoryType = CategoryType.Food }

                ]);

                menuCategories.AddRange(
                [
                    new() { Name = "Topli napici", RestaurantId = restaurants[i].Id, CategoryType = CategoryType.Drink  },
                    new() { Name = "Gazirana pića", RestaurantId = restaurants[i].Id, CategoryType = CategoryType.Drink },
                    new() { Name = "Negazirana pića", RestaurantId = restaurants[i].Id, CategoryType = CategoryType.Drink },
                    new() { Name = "Prirodni sokovi", RestaurantId = restaurants[i].Id, CategoryType = CategoryType.Drink },
                    new() { Name = "Vode", RestaurantId = restaurants[i].Id, CategoryType = CategoryType.Drink }
                ]);
            }

            for (int i = 0; i < menuCategories.Count; i++)
            {
                menuCategories[i].Id = i + 1;
            }

            return menuCategories;
        }
    }
}
