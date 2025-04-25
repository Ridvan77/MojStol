using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class RestaurantTypeRepository : IRestaurantTypeRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IRestaurantRepository _restaurantRepo;

        public RestaurantTypeRepository(ApplicationDbContext context, IRestaurantRepository restaurantRepo)
        {
            _context = context;
            _restaurantRepo = restaurantRepo;
        }

        public async Task<List<RestaurantType>> GetAllAsync()
        {
            return await _context.RestaurantTypes.ToListAsync();
        }

        public async Task<RestaurantType?> GetByIdAsync(int id)
        {
            return await _context.RestaurantTypes.FindAsync(id);
        }

        public async Task<RestaurantType?> CreateAsync(RestaurantType restaurantType)
        {
            var restaurantTypeSameNameExist = await _context.RestaurantTypes.AnyAsync(rt => rt.Name == restaurantType.Name);
            if (restaurantTypeSameNameExist)
            {
                return null;
            }

            _context.RestaurantTypes.Add(restaurantType);
            await _context.SaveChangesAsync();
            return restaurantType;
        }

        public async Task<RestaurantType?> UpdateAsync(int id, RestaurantType restaurantType)
        {
            var existingRestaurantType = await GetByIdAsync(id);
            if (existingRestaurantType == null) return null;

            var restaurantTypeSameNameExist = await _context.RestaurantTypes.AnyAsync(rt => rt.Name == restaurantType.Name);
            if (restaurantTypeSameNameExist)
            {
                return null;
            }

            existingRestaurantType.Name = restaurantType.Name;
            existingRestaurantType.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return existingRestaurantType;
        }

        public async Task<RestaurantType?> DeleteAsync(int id)
        {
            var restaurantTypeModel = await GetByIdAsync(id);
            if (restaurantTypeModel == null) return null;

            await DeleteRestaurantTypeRelatedDataAsync(id, restaurantTypeModel);

            await _context.SaveChangesAsync();

            return restaurantTypeModel;
        }

        public async Task DeleteRestaurantTypeRelatedDataAsync(int restaurantTypeId, RestaurantType restaurantType)
        {
            // Restaurants
            var restaurants = _context.Restaurants.Where(r => r.RestaurantTypeId == restaurantTypeId);
            if (restaurants.Any())
            {
                foreach (var restaurant in restaurants)
                {
                    await _restaurantRepo.DeleteRestaurantRelatedDataAsync(restaurant.Id, restaurant);
                }
            }

            _context.RestaurantTypes.Remove(restaurantType);

            // Save changes for all the deletions
            //await _context.SaveChangesAsync();
        }

        public async Task<bool> RestaurantTypeExists(int id)
        {
            return await _context.RestaurantTypes.AnyAsync(rt => rt.Id == id);
        }
    }
}
