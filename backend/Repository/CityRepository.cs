using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class CityRepository : ICityRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IRestaurantRepository _restaurantRepo;
        public CityRepository(ApplicationDbContext context, IRestaurantRepository restaurantRepo)
        {
            _context = context;
            _restaurantRepo = restaurantRepo;
        }

        public async Task<List<City>> GetAllAsync()
        {
            return await _context.Cities.ToListAsync();
        }

        public async Task<City?> GetByIdAsync(int id)
        {
            return await _context.Cities.FindAsync(id);
        }

        public async Task<City?> CreateAsync(City city)
        {
            var citySameNameExist = await _context.Cities.AnyAsync(c => c.Name == city.Name);
            if (citySameNameExist)
            {
                return null;
            }

            _context.Cities.Add(city);
            await _context.SaveChangesAsync();
            return city;
        }

        public async Task<City?> UpdateAsync(int id, City city)
        {
            var existingCity = await GetByIdAsync(id);
            if (existingCity == null) return null;

            var citySameNameExist = await _context.Cities.AnyAsync(c => c.Name == city.Name);
            if (citySameNameExist)
            {
                return null;
            }

            existingCity.Name = city.Name;
            existingCity.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return existingCity;
        }

        public async Task<City?> DeleteAsync(int id)
        {
            var cityModel = await GetByIdAsync(id);
            if (cityModel == null) return null;

            await DeleteCityRelatedDataAsync(id, cityModel);

            await _context.SaveChangesAsync();

            return cityModel;
        }

        public async Task DeleteCityRelatedDataAsync(int cityId, City city)
        {
            // Restaurants
            var restaurants = _context.Restaurants.Where(r => r.CityId == cityId);
            if (restaurants.Any())
            {
                foreach (var restaurant in restaurants)
                {
                    await _restaurantRepo.DeleteRestaurantRelatedDataAsync(restaurant.Id, restaurant);
                }
            }

            _context.Cities.Remove(city);

            // Save changes for all the deletions
            //await _context.SaveChangesAsync();
        }

        public Task<bool> CitytExists(int id)
        {
            return _context.Cities.AnyAsync(s => s.Id == id);
        }
    }
}
