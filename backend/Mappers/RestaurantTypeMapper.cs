using backend.Dtos.RestaurantType;
using backend.Models;

namespace backend.Mappers
{
    public static class RestaurantTypeMapper
    {
        public static RestaurantTypeDto ToRestaurantTypeDto(this RestaurantType restaurantTypeModel)
        {
            return new()
            {
                Id = restaurantTypeModel.Id,
                Name = restaurantTypeModel.Name
            };
        }

        public static RestaurantType ToRestaurantTypeFromCreate(this RestaurantTypeCreateDto restaurantTypeDto)
        {
            return new()
            {
                Name = restaurantTypeDto.Name.Trim()
            };
        }

        public static RestaurantType ToRestaurantTypeFromUpdate(this RestaurantTypeUpdateDto restaurantTypeDto)
        {
            return new()
            {
                Name = restaurantTypeDto.Name.Trim()
            };
        }
    }
}
