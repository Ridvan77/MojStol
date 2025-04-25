using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models;

namespace Models
{
    public class RestaurantFacilities
    {
        [Key]
        public int RestaurantFacilitiesID { get; set; }
        [ForeignKey(nameof(Restaurant))]
        public int RestaurantID { get; set; }
        public Restaurant? Restaurant { get; set; }
        [ForeignKey(nameof(Facilities))]
        public int FacilitiesID { get; set; }
        public Facilities? Facilities { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsActive { get; set; }
    }
}