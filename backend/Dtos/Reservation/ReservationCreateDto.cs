namespace backend.Dtos.Reservation
{
    public class ReservationCreateDto
    {
        public int UserID {get; set;}
        public int RestaurantID {get; set;} 
        public int TableID {get; set;}
        public string Name { get; set; }
        public DateOnly ReservationDate {get; set;}
        public TimeOnly ReservationTime {get; set;}
        public string Email { get; set; }
        public int NumberOfPersons {get; set;}
        public int StatusID {get; set;} = 0;
        public DateTime CreatedAt {get; set;} = DateTime.Now;
    }
}