using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class MenuCategoryRepository : IMenuCategoryRepository
    {
        private readonly ApplicationDbContext _context;
        public MenuCategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<MenuCategory>> GetAllAsync(int restaurantId)
        {
            return await _context.MenuCategories.Where(mc => mc.RestaurantId == restaurantId).ToListAsync();
        }

        public async Task<MenuCategory?> GetByIdAsync(int restaurantId, int id)
        {
            return await _context.MenuCategories
                .FirstOrDefaultAsync(mc => mc.RestaurantId == restaurantId && mc.Id == id);
        }

        public async Task<MenuCategory> CreateAsync(MenuCategory menuCategory)
        {
            _context.MenuCategories.Add(menuCategory);
            await _context.SaveChangesAsync();
            return menuCategory;
        }

        public async Task<MenuCategory?> UpdateAsync(int restaurantId, int id, MenuCategory menuCategory)
        {
            var existingMenuCategory = await GetByIdAsync(restaurantId, id);

            if (existingMenuCategory == null) return null;

            existingMenuCategory.Name = menuCategory.Name;
            existingMenuCategory.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return existingMenuCategory;
        }

        public async Task<MenuCategory?> DeleteAsync(int restaurantId, int id)
        {
            var menuCategory = await GetByIdAsync(restaurantId, id);
            if (menuCategory == null) return null;

            await DeleteMenuCategoryRelatedDataAsync(id, menuCategory);

            await _context.SaveChangesAsync();

            return menuCategory;
        }

        public async Task DeleteMenuCategoryRelatedDataAsync(int menuCategoryId, MenuCategory menuCategory)
        {
            // Menu Items
            var menuItems = _context.MenuItems.Where(mi => mi.MenuCategoryId == menuCategoryId);
            if (await menuItems.AnyAsync())
            {
                _context.MenuItems.RemoveRange(menuItems);
            }

            _context.MenuCategories.Remove(menuCategory);

            // Save changes for all the deletions
            //await _context.SaveChangesAsync();
        }
    }
}