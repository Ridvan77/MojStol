using System.ComponentModel.DataAnnotations;
using backend.Models;

namespace Models
{
    public class Facilities
    {
        [Key]
        public int FacilitiesID { get; set; }
        public string Name { get; set; }
    }
}