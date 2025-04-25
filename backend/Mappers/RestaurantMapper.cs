using backend.Dtos.Restaurant;
using backend.Models;

namespace backend.Mappers
{
    public static class RestaurantMapper
    {
        public static RestaurantDto ToRestaurantDto(this Restaurant restaurantModel)
        {
            return new()
            {
                Id = restaurantModel.Id,
                LogoUrl = restaurantModel.LogoUrl,
                Name = restaurantModel.Name,
                Description = restaurantModel.Description,
                WebSite = restaurantModel.WebSite,
                Latitude = restaurantModel.Latitude,
                Longitude = restaurantModel.Longitude,
                AverageRating = restaurantModel.AverageRating,
                ContactEmail = restaurantModel.ContactEmail,
                ContactNumber = restaurantModel.ContactNumber,
                OwnerId = restaurantModel.OwnerId,
                CityId = restaurantModel.CityId,
                RestaurantTypeId = restaurantModel.RestaurantTypeId,
                City = restaurantModel.City?.ToCityDto(),
                RestaurantType = restaurantModel.RestaurantType?.ToRestaurantTypeDto(),
                Street = restaurantModel.Street
            };
        }

        public static Restaurant ToRestaurantFromCreate(this RestaurantCreateDto restaurantDto)
        {
            return new()
            {
                Name = restaurantDto.Name.Trim(),
                Description = restaurantDto.Description.Trim(),
                WebSite = restaurantDto.WebSite?.Trim(),
                ContactEmail = restaurantDto.ContactEmail.Trim(),
                ContactNumber = restaurantDto.ContactNumber.Trim(),
                OwnerId = restaurantDto.OwnerId,
                CityId = restaurantDto.CityId,
                RestaurantTypeId = restaurantDto.RestaurantTypeId,
                Street = restaurantDto.Street.Trim()
            };
        }

        public static Restaurant ToRestaurantFromUpdate(this RestaurantUpdateDto restaurantDto)
        {
            return new()
            {
                Name = restaurantDto.Name.Trim(),
                Description = restaurantDto.Description.Trim(),
                WebSite = restaurantDto.WebSite?.Trim(),
                ContactEmail = restaurantDto.ContactEmail.Trim(),
                ContactNumber = restaurantDto.ContactNumber.Trim(),
                OwnerId = restaurantDto.OwnerId,
                CityId = restaurantDto.CityId,
                RestaurantTypeId = restaurantDto.RestaurantTypeId,
                Street = restaurantDto.Street.Trim(),
            };
        }
    }
}
