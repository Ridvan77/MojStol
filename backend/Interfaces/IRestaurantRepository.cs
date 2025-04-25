using backend.Dtos.Restaurant;
using backend.Helpers;
using backend.Helpers.QueryObjects;
using backend.Models;

namespace backend.Interfaces
{
    public interface IRestaurantRepository
    {
        Task<PagedResult<Restaurant>> GetAllAsync(RestaurantQueryObject queryObject);
        Task<Restaurant?> GetByIdAsync(int id);
        Task<Restaurant> CreateAsync(Restaurant restuarantModel);
        Task<Restaurant?> UpdateAsync(int id, Restaurant restuarantModel);
        Task<Restaurant?> UpdateLogoAsync(int id, RestaurantLogoDto restuarantLogoModel);
        Task<Restaurant?> UpdateLocationAsync(int id, RestaurantLocationDto restuarantLocationModel);
        Task<Restaurant?> DeleteLocationAsync(int id);
        Task<Restaurant?> DeleteAsync(int id);
        Task DeleteRestaurantRelatedDataAsync(int id, Restaurant restaurant);
        Task<Restaurant?> DeleteLogoAsync(int id);
        Task<bool> RestaurantExists(int id);
    }
}
