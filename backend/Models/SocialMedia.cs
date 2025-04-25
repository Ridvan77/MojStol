using System.ComponentModel.DataAnnotations;
using backend.Models;

namespace Models
{
    public class SocialMedia
    {
        [Key]
        public int SocialMediaID { get; set; }
        public string Name { get; set; }
    }
}