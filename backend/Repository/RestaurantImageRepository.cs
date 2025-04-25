using backend.Data;
using backend.Dtos.RestaurantImage;
using backend.Helpers;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class RestaurantImageRepository : IRestaurantImageRepository
    {
        private readonly ApplicationDbContext _context;
        public RestaurantImageRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<RestaurantImage>> GetAllAsync(int restaurantId)
        {
            return await _context.RestaurantImages.Where(x => x.RestaurantId == restaurantId).ToListAsync();
        }

        public async Task<List<RestaurantImage>> CreateAsync(int restaurantId, List<RestaurantImageCreateDto> restaurantImages)
        {
            var savedImages = new List<RestaurantImage>();

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), ImageConfig.ImagesFolder);
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            foreach (var imageDto in restaurantImages)
            {
                if (string.IsNullOrEmpty(imageDto.Base64Image))
                {
                    continue;
                }

                byte[] imageBytes = imageDto.Base64Image.ParseBase64();
                if (imageBytes == null)
                {
                    continue;
                }

                byte[] imageBytesResized = ImageHelper.ResizeImage(imageBytes, 1000);
                if (imageBytesResized == null)
                {
                    continue;
                }

                var fileName = $"{Guid.NewGuid()}.jpg";
                var filePath = Path.Combine(folderPath, fileName);

                await File.WriteAllBytesAsync(filePath, imageBytesResized);

                var restaurantImage = new RestaurantImage
                {
                    ImageUrl = $"{ImageConfig.Images}/{fileName}",
                    RestaurantId = restaurantId
                };

                savedImages.Add(restaurantImage);
            }

            if (savedImages.Any())
            {
                await _context.RestaurantImages.AddRangeAsync(savedImages);
                await _context.SaveChangesAsync();
            }

            return savedImages;
        }

        public async Task<List<RestaurantImage>?> DeleteAsync(int restaurantId, List<int> imageIds)
        {
            var imagesToDelete = await _context.RestaurantImages
            .Where(ri => ri.RestaurantId == restaurantId && imageIds.Contains(ri.Id))
            .ToListAsync();

            if (!imagesToDelete.Any())
            {
                return null;
            }

            await DeleteRestaurantImageRelatedDataAsync(imagesToDelete);

            await _context.SaveChangesAsync();

            return imagesToDelete;
        }

        public Task DeleteRestaurantImageRelatedDataAsync(List<RestaurantImage> imagesToDelete)
        {
            foreach (var image in imagesToDelete)
            {
                if (!string.IsNullOrEmpty(image.ImageUrl))
                {
                    var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", image.ImageUrl);
                    if (File.Exists(oldFilePath))
                    {
                        try
                        {
                            File.Delete(oldFilePath);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error deleting image {image.ImageUrl}: {ex.Message}");
                        }
                    }
                }
            }

            _context.RestaurantImages.RemoveRange(imagesToDelete);
            return Task.CompletedTask;

            // Save changes for all the deletions
            //await _context.SaveChangesAsync();
        }
    }
}