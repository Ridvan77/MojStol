using backend.Models;

namespace backend.Interfaces
{
    public interface IMenuCategoryRepository
    {
        Task<List<MenuCategory>> GetAllAsync(int restaurantId);
        Task<MenuCategory?> GetByIdAsync(int restaurantId, int id);
        Task<MenuCategory> CreateAsync(MenuCategory menuCategory);
        Task<MenuCategory?> UpdateAsync(int restaurantId, int id, MenuCategory menuCategory);
        Task<MenuCategory?> DeleteAsync(int restaurantId, int id);
        Task DeleteMenuCategoryRelatedDataAsync(int id, MenuCategory menuCategory);
    }
}
