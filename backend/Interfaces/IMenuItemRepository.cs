using backend.Models;

namespace backend.Interfaces
{
    public interface IMenuItemRepository
    {
        Task<List<MenuItem>> GetAllAsync(int restaurantId);
        Task<MenuItem?> GetByIdAsync(int restaurantId, int id);
        Task<MenuItem> CreateAsync(MenuItem menuItem);
        Task<MenuItem?> UpdateAsync(int restaurantId, int id, MenuItem menuItem);
        Task<MenuItem?> DeleteAsync(int restaurantId, int id);
    }
}
