using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models;

namespace backend.Models
{
    public class ReviewVotes
    {
        [Key]
        public int ReviewVotesID { get; set; }
        [ForeignKey(nameof(User))]
        public int UserID { get; set; }
        public User? User { get; set; }
        [ForeignKey(nameof(Review))]
        public int ReviewID { get; set; }
        public Review? Review { get; set; }
        public bool IsLike { get; set; }
    }
}