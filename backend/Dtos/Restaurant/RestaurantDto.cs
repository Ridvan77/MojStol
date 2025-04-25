using backend.Dtos.City;
using backend.Dtos.RestaurantType;

namespace backend.Dtos.Restaurant
{
    public class RestaurantDto
    {
        public int Id { get; set; }
        public string? LogoUrl { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? WebSite { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public float AverageRating { get; set; }
        public int OwnerId { get; set; }
        public int CityId { get; set; }
        public int RestaurantTypeId { get; set; }
        public CityDto? City { get; set; }
        public RestaurantTypeDto? RestaurantType { get; set; }
        public string Street { get; set; } = string.Empty!;
        public string ContactNumber { get; set; } = string.Empty!;
        public string ContactEmail { get; set; } = string.Empty!;
    }
}
