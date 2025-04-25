using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class MenuItemRepository : IMenuItemRepository
    {
        private readonly ApplicationDbContext _context;
        public MenuItemRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<MenuItem>> GetAllAsync(int restaurantId)
        {
            return await _context.MenuItems.Where(mi => mi.MenuCategory.RestaurantId == restaurantId).ToListAsync();
        }

        public async Task<MenuItem?> GetByIdAsync(int restaurantId, int id)
        {
            var menuCategories = await _context.MenuCategories.Where(mc => mc.RestaurantId == restaurantId).ToListAsync();
            if (!menuCategories.Any()) return null;

            var menuItem = await _context.MenuItems.FindAsync(id);
            if (menuItem == null) return null;

            if (!menuCategories.Any(mc => mc.Id == menuItem.MenuCategoryId))
                return null;

            return menuItem;
        }

        public async Task<MenuItem> CreateAsync(MenuItem menuItem)
        {
            _context.MenuItems.Add(menuItem);
            await _context.SaveChangesAsync();
            return menuItem;
        }

        public async Task<MenuItem?> UpdateAsync(int restaurantId, int id, MenuItem menuItem)
        {
            var existingMenuItem = await GetByIdAsync(restaurantId, id);
            if (existingMenuItem == null) return null;

            existingMenuItem.Name = menuItem.Name;
            existingMenuItem.Price = menuItem.Price;
            existingMenuItem.Description = menuItem.Description;
            existingMenuItem.MenuCategoryId = menuItem.MenuCategoryId;
            existingMenuItem.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingMenuItem;
        }

        public async Task<MenuItem?> DeleteAsync(int restaurantId, int id)
        {
            var menuItem = await GetByIdAsync(restaurantId, id);
            if (menuItem == null) return null;

            _context.MenuItems.Remove(menuItem);
            await _context.SaveChangesAsync();

            return menuItem;
        }
    }
}