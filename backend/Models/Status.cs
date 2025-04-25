namespace backend.Models
{
    public enum ReservationStatus {Pending, Confirmed, Cancelled}
    public class Status 
    {
        public int StatusID {get; set;}
        public ReservationStatus Name {get; set;}
    }
}