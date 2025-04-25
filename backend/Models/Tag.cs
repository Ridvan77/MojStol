using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Tag
    {
        [Key]
        public int TagID { get; set; }
        public string Name { get; set; }

        public ICollection<RestaurantTag> RestaurantTags { get; set; } = new List<RestaurantTag>();
    }
}
