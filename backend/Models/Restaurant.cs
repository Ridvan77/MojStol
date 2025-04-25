using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Restaurant
    {
        [Key]
        public int Id { get; set; }
        public string? LogoUrl { get; set; }
        public string Name { get; set; } = default!;
        public string Description { get; set; } = default!;
        public string? WebSite { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        // dodao umjesto not mapped
        public float AverageRating { get; set; }

        public string ContactNumber { get; set; } = default!;
        public string ContactEmail { get; set; } = default!;

        [ForeignKey(nameof(Owner))]
        public int OwnerId { get; set; }
        public User? Owner { get; set; }

        [ForeignKey(nameof(City))]
        public int CityId { get; set; }
        public City? City { get; set; }

        [ForeignKey(nameof(RestaurantType))]
        public int RestaurantTypeId { get; set; }
        public RestaurantType? RestaurantType { get; set; }

        public string Street { get; set; } = default!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
