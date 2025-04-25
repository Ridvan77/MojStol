using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class RestaurantTag
    {
        [Key]
        public int RestaurantTagId { get; set; }

        [ForeignKey(nameof(Restaurant))]
        public int RestaurantId { get; set; }

        [JsonIgnore]
        public Restaurant? Restaurant { get; set; }

        [ForeignKey(nameof(Tag))]
        public int TagID { get; set; }
        [JsonIgnore]
        public Tag? Tag { get; set; }

        public DateTime CreatedAt { get; set; }

    }
}
