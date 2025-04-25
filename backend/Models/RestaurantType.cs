using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class RestaurantType
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = default!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
