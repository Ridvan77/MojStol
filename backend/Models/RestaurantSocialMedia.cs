using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models;

namespace Models
{
    public class RestaurantSocialMedia
    {
        [Key]
        public int RestaurantSocialMediaID { get; set; }
        [ForeignKey(nameof(Restaurant))]
        public int RestaurantID { get; set; }
        public Restaurant? Restaurant { get; set; }
        [ForeignKey(nameof(SocialMedia))]
        public int SocialMediaID { get; set; }
        public SocialMedia? SocialMedia { get; set; }
        public string Link { get; set; }
    }
}