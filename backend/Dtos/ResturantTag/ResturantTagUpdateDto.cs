namespace backend.Dtos.RestaurantTag
{
    public class RestaurantTagUpdateDto
    {
        public int RestaurantTagId { get; set; }
        public int RestaurantID { get; set; }
        public int TagID { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
