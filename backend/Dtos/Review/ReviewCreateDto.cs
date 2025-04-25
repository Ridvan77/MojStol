namespace backend.Dtos.Review
{
    public class ReviewCreateDto
    {
        public int UserID {get; set;}
        public int RestaurantID {get; set;}
        public float Rating {get; set;}
        public string? Comment {get; set;}
        public DateTime CreatedAt {get; set;} = DateTime.Now;
    }
}