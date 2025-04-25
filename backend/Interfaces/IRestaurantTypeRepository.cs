using backend.Models;

namespace backend.Interfaces
{
    public interface IRestaurantTypeRepository
    {
        Task<List<RestaurantType>> GetAllAsync();
        Task<RestaurantType?> GetByIdAsync(int id);
        Task<RestaurantType?> CreateAsync(RestaurantType restuarantTypeModel);
        Task<RestaurantType?> UpdateAsync(int id, RestaurantType restuarantTypeModel);
        Task<RestaurantType?> DeleteAsync(int id);
        Task<bool> RestaurantTypeExists(int id);
    }
}
