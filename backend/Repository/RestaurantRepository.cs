using backend.Data;
using backend.Dtos.Restaurant;
using backend.Helpers;
using backend.Helpers.QueryObjects;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class RestaurantRepository : IRestaurantRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ITableRepository _tableRepo;
        private readonly IMenuCategoryRepository _menuCategoryRepo;
        private readonly IRestaurantImageRepository _restaurantImageRepo;
        public RestaurantRepository(ApplicationDbContext context, ITableRepository tableRepo, IMenuCategoryRepository menuCategoryRepo, IRestaurantImageRepository restaurantImageRepo)
        {
            _context = context;
            _tableRepo = tableRepo;
            _menuCategoryRepo = menuCategoryRepo;
            _restaurantImageRepo = restaurantImageRepo;
        }

        public IQueryable<Restaurant> AddInclude(IQueryable<Restaurant> restaurants)
        {
            return restaurants
                .Include(r => r.City)
                .Include(r => r.RestaurantType);
        }

        public IQueryable<Restaurant> AddFilter(IQueryable<Restaurant> restaurants, RestaurantQueryObject queryObject)
        {
            if (!string.IsNullOrWhiteSpace(queryObject.RestaurantName))
            {
                restaurants = restaurants.Where(r => r.Name.Contains(queryObject.RestaurantName));
            }

            if (!string.IsNullOrWhiteSpace(queryObject.SortBy))
            {
                if (queryObject.SortBy.Equals("Restaurant", StringComparison.OrdinalIgnoreCase))
                {
                    restaurants = queryObject.IsDecsending ? restaurants.OrderByDescending(r => r.Name) : restaurants.OrderBy(r => r.Name);
                }

                if (queryObject.SortBy.Equals("AverageRating", StringComparison.OrdinalIgnoreCase))
                {
                    restaurants = queryObject.IsDecsending ? restaurants.OrderByDescending(r => r.AverageRating) : restaurants.OrderBy(r => r.AverageRating);
                }
            }

            if (queryObject.RestaurantTypeId != 0)
            {
                restaurants = restaurants.Where(r => r.RestaurantTypeId == queryObject.RestaurantTypeId);
            }
            if (queryObject.CityId != 0)
            {
                restaurants = restaurants.Where(r => r.CityId == queryObject.CityId);
            }
            if (queryObject.OwnerId != 0)
            {
                restaurants = restaurants.Where(r => r.OwnerId == queryObject.OwnerId);
            }

            if (queryObject.TagIds != null && queryObject.TagIds.Any())
            {
                restaurants = restaurants
                .Where(r => _context.RestaurantTags
                    .Where(rt => rt.RestaurantId == r.Id && queryObject.TagIds.Contains(rt.TagID))
                    .Count() == queryObject.TagIds.Count);
            }
            if (queryObject.PaymentMethodIds != null && queryObject.PaymentMethodIds.Any())
            {
                restaurants = restaurants
                .Where(r => _context.RestaurantsPaymentMethod
                    .Where(rpm => rpm.RestaurantID == r.Id && queryObject.PaymentMethodIds.Contains(rpm.PaymentMethodID))
                    .Count() == queryObject.PaymentMethodIds.Count);
            }
            if (queryObject.FacilityIds != null && queryObject.FacilityIds.Any())
            {
                restaurants = restaurants
                .Where(r => _context.RestaurantFacilities
                    .Where(rf => rf.RestaurantID == r.Id && queryObject.FacilityIds.Contains(rf.FacilitiesID))
                    .Count() == queryObject.FacilityIds.Count);
            }

            return restaurants;
        }
        public async Task<PagedResult<Restaurant>> GetAllAsync(RestaurantQueryObject queryObject)
        {
            var restaurants = _context.Restaurants.AsQueryable();

            restaurants = AddInclude(restaurants);
            restaurants = AddFilter(restaurants, queryObject);

            var count = restaurants.Count();

            if (queryObject.PageNumber != 0 && queryObject.PageSize != 0)
            {
                var skipNumber = (queryObject.PageNumber - 1) * queryObject.PageSize;
                restaurants = restaurants.Skip(skipNumber).Take(queryObject.PageSize);
            }

            return new PagedResult<Restaurant>
            {
                Count = count,
                ResultList = await restaurants.ToListAsync()
            };
        }

        public async Task<Restaurant?> GetByIdAsync(int id)
        {
            return await _context.Restaurants
                .Include(r => r.City)
                .Include(r => r.RestaurantType)
                .FirstAsync(r => r.Id == id);
        }

        public async Task<Restaurant> CreateAsync(Restaurant restaurant)
        {
            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();
            return restaurant;
        }

        public async Task<Restaurant?> UpdateAsync(int id, Restaurant restaurant)
        {
            var existingRestaurant = await GetByIdAsync(id);
            if (existingRestaurant == null) return null;

            existingRestaurant.Name = restaurant.Name;
            existingRestaurant.Description = restaurant.Description;
            existingRestaurant.ContactEmail = restaurant.ContactEmail;
            existingRestaurant.ContactNumber = restaurant.ContactNumber;
            existingRestaurant.Street = restaurant.Street;
            existingRestaurant.WebSite = restaurant.WebSite;
            existingRestaurant.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return existingRestaurant;
        }

        public async Task<Restaurant?> UpdateLogoAsync(int id, RestaurantLogoDto restuarantLogoModel)
        {
            var existingRestaurant = await GetByIdAsync(id);
            if (existingRestaurant == null) return null;

            if (string.IsNullOrEmpty(restuarantLogoModel.Base64Image))
            {
                return null;
            }

            byte[] imageBytes = restuarantLogoModel.Base64Image.ParseBase64();
            if (imageBytes == null)
            {
                return null;
            }

            byte[] imageBytesResized = ImageHelper.ResizeImage(imageBytes, 250);
            if (imageBytesResized == null)
            {
                return null;
            }

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), ImageConfig.LogosFolder);
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            // If the restaurant already has a logo, delete the old logo file
            if (!string.IsNullOrEmpty(existingRestaurant.LogoUrl))
            {
                var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", existingRestaurant.LogoUrl);
                if (File.Exists(oldFilePath))
                {
                    try
                    {
                        File.Delete(oldFilePath); // Delete the old logo file
                    }
                    catch (Exception ex)
                    {
                        // Log the error if something goes wrong with deleting the old file
                        // You may want to handle this more gracefully in production
                        Console.WriteLine($"Error deleting old logo: {ex.Message}");
                    }
                }
            }

            var fileName = $"{Guid.NewGuid()}.jpg";
            var filePath = Path.Combine(folderPath, fileName);

            await File.WriteAllBytesAsync(filePath, imageBytesResized);

            existingRestaurant.LogoUrl = $"{ImageConfig.Logos}/{fileName}";
            existingRestaurant.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return existingRestaurant;
        }

        public async Task<Restaurant?> UpdateLocationAsync(int id, RestaurantLocationDto restuarantLocationModel)
        {
            var existingRestaurant = await GetByIdAsync(id);
            if (existingRestaurant == null) return null;

            existingRestaurant.Latitude = restuarantLocationModel.Latitude;
            existingRestaurant.Longitude = restuarantLocationModel.Longitude;
            existingRestaurant.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return existingRestaurant;
        }

        public async Task<Restaurant?> DeleteLocationAsync(int id)
        {
            var existingRestaurant = await GetByIdAsync(id);
            if (existingRestaurant == null) return null;

            existingRestaurant.Latitude = null;
            existingRestaurant.Longitude = null;
            existingRestaurant.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return existingRestaurant;
        }

        public async Task<Restaurant?> DeleteAsync(int id)
        {
            var restaurantModel = await GetByIdAsync(id);
            if (restaurantModel == null) return null;

            await DeleteRestaurantRelatedDataAsync(id, restaurantModel);

            await _context.SaveChangesAsync();

            return restaurantModel;
        }

        public async Task DeleteRestaurantRelatedDataAsync(int restaurantId, Restaurant restaurant)
        {
            // Menu Categories
            var menuCategories = _context.MenuCategories.Where(mc => mc.RestaurantId == restaurantId);
            if (await menuCategories.AnyAsync())
            {
                foreach (var menuCategory in menuCategories)
                {
                    await _menuCategoryRepo.DeleteMenuCategoryRelatedDataAsync(menuCategory.Id, menuCategory);
                }
            }

            // Restaurant Images
            var restaurantImages = _context.RestaurantImages.Where(ri => ri.RestaurantId == restaurantId);
            if (await restaurantImages.AnyAsync())
            {
                await _restaurantImageRepo.DeleteRestaurantImageRelatedDataAsync([.. restaurantImages]);
            }

            // Tables
            var tables = _context.Tables.Where(t => t.RestaurantId == restaurantId);
            if (await tables.AnyAsync())
            {
                foreach (var table in tables)
                {
                    await _tableRepo.DeleteTableRelatedDataAsync(table.Id, table);
                }
            }

            // Working Hours
            var workingHours = _context.WorkingHours.Where(wh => wh.RestaurantId == restaurantId);
            if (await workingHours.AnyAsync())
            {
                _context.WorkingHours.RemoveRange(workingHours);
            }

            // Restaurants Payment Method
            var restaurantPaymentMethods = _context.RestaurantsPaymentMethod.Where(rpm => rpm.RestaurantID == restaurantId);
            if (await restaurantPaymentMethods.AnyAsync())
            {
                _context.RestaurantsPaymentMethod.RemoveRange(restaurantPaymentMethods);
            }

            // Restaurant Tags
            var restaurantTags = _context.RestaurantTags.Where(rt => rt.RestaurantId == restaurantId);
            if (await restaurantTags.AnyAsync())
            {
                _context.RestaurantTags.RemoveRange(restaurantTags);
            }

            // Restaurant Facilities
            var restaurantFacilities = _context.RestaurantFacilities.Where(rf => rf.RestaurantID == restaurantId);
            if (await restaurantFacilities.AnyAsync())
            {
                _context.RestaurantFacilities.RemoveRange(restaurantFacilities);
            }

            // Restaurant Social Medias
            var restaurantSocialMedias = _context.RestaurantSocialMedias.Where(rsm => rsm.RestaurantID == restaurantId);
            if (await restaurantSocialMedias.AnyAsync())
            {
                _context.RestaurantSocialMedias.RemoveRange(restaurantSocialMedias);
            }

            // Reviews and Review Votes
            var reviews = _context.Reviews.Where(r => r.RestaurantID == restaurantId);
            if (await reviews.AnyAsync())
            {
                var reviewVotes = _context.ReviewVotes.Where(rv => reviews.Any(r => r.ReviewID == rv.ReviewID));

                _context.ReviewVotes.RemoveRange(reviewVotes);
                _context.Reviews.RemoveRange(reviews);
            }

            // Reservations
            var reservations = _context.Reservations.Where(r => r.RestaurantID == restaurantId);
            if (await reservations.AnyAsync())
            {
                _context.Reservations.RemoveRange(reservations);
            }

            await DeleteLogoAsync(restaurantId);

            _context.Restaurants.Remove(restaurant);

            // Save changes for all the deletions
            //await _context.SaveChangesAsync();
        }

        public async Task<Restaurant?> DeleteLogoAsync(int id)
        {
            var restaurantModel = await GetByIdAsync(id);
            if (restaurantModel == null) return null;

            if (!string.IsNullOrEmpty(restaurantModel.LogoUrl))
            {
                var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", restaurantModel.LogoUrl);
                if (File.Exists(oldFilePath))
                {
                    try
                    {
                        File.Delete(oldFilePath);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error deleting old logo: {ex.Message}");
                    }
                }
            }

            restaurantModel.LogoUrl = null;
            await _context.SaveChangesAsync();

            return restaurantModel;
        }

        public Task<bool> RestaurantExists(int id)
        {
            return _context.Restaurants.AnyAsync(s => s.Id == id);
        }
    }
}
