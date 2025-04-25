namespace backend.Dtos.Favourites
{
    public class FavouriteCreateDto
    {
        public int UserID {get; set;}
        public int RestaurantID {get; set;} 
        public DateTime DateAdded { get; set; } = DateTime.Now;
    }
}