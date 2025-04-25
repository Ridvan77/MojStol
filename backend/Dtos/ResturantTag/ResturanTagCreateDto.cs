namespace backend.Dtos.RestaurantTag
{
    public class RestaurantTagCreateDto
    {
        public int RestaurantID { get; set; }
        public int TagID { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
