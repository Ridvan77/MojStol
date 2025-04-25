using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models;

namespace backend.Models
{
    public class Review 
    {
        [Key]
        public int ReviewID {get; set;}
        [ForeignKey(nameof(User))]
        public int UserID {get; set;}
        public User? User { get; set; }
        [ForeignKey(nameof(Restaurant))]
        public int RestaurantID {get; set;}
        public Restaurant? Restaurant { get; set; }
        public float Rating {get; set;}
        public string? Comment {get; set;}
        public DateTime CreatedAt {get; set;}
    }
}