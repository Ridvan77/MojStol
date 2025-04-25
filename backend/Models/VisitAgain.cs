using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models;

namespace Models
{
    public class VisitAgain
    {
        [Key]
        public int VisitAgainID { get; set; }
        [ForeignKey(nameof(User))]
        public int UserID { get; set; }
        public User? User { get; set; }
        [ForeignKey(nameof(Restaurant))]
        public int RestaurantID { get; set; }
        public Restaurant? Restaurant { get; set; }
        public int VisitCount { get; set; }
    }
}