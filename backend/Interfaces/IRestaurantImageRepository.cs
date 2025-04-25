using backend.Dtos.RestaurantImage;
using backend.Models;

namespace backend.Interfaces
{
    public interface IRestaurantImageRepository
    {
        Task<List<RestaurantImage>> GetAllAsync(int restaurantId);
        Task<List<RestaurantImage>> CreateAsync(int restaurantId, List<RestaurantImageCreateDto> restaurantImages);
        Task<List<RestaurantImage>?> DeleteAsync(int restaurantId, List<int> imageIds);
        Task DeleteRestaurantImageRelatedDataAsync(List<RestaurantImage> restaurantImages);
    }
}
