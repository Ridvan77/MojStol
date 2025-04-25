using backend.Dtos.RestaurantImage;
using backend.Models;

namespace backend.Mappers
{
    public static class RestaurantImageMapper
    {

        public static RestaurantImageDto ToRestaurantImageDto(this RestaurantImage restaurantImageModel)
        {
            return new()
            {
                Id = restaurantImageModel.Id,
                ImageUrl = restaurantImageModel.ImageUrl,
            };
        }
    }
}
