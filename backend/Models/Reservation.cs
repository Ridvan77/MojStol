using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Reservation
    {
        [Key]
        public int ReservationID { get; set; }
        [ForeignKey(nameof(User))]
        public int UserID { get; set; }
        public User? User { get; set; }
        [ForeignKey(nameof(Restaurant))]
        public int RestaurantID { get; set; }
        public Restaurant? Restaurant { get; set; }
        [ForeignKey(nameof(Table))]
        public int TableID { get; set; }
        public Table? Table { get; set; }
        public string Name { get; set; }
        public DateOnly ReservationDate { get; set; }
        public TimeOnly ReservationTime { get; set; }
        public string Email { get; set; }
        public int NumberOfPersons { get; set; }
        [ForeignKey(nameof(Status))]
        public int StatusID { get; set; }
        public Status? Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsScanned { get; set; } = false;
    }
}
