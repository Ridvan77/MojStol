using backend.Models;

namespace backend.Helpers.DataSeeders
{
    public static class ReviewDataSeeder
    {
        public static (List<Review>, List<Restaurant>) GetReviews(List<Restaurant> restaurants, List<User> users)
        {
            var reviews = new List<Review>();

            List<int> usersIdList = [.. users.Where(u => u.RoleId == 2).Select(u => u.UserId)];
            //List<int> usersIdList = [1, 2, 3, 8];
            int userCount = usersIdList.Count;
            int restaurantCount = restaurants.Count;
            int restaurantPerUser = (int)Math.Ceiling((double)restaurantCount / userCount);

            int restaurantIndex = 0;

            //var random = new Random();
            //var ratings = new List<int>();

            //for (int i = 0; i < userCount; i++)
            //{
            //    ratings.Add(random.Next(1, 6));
            //}
            var ratings = new[] { 5, 4, 3, 3 };

            for (int i = 0; i < userCount; i++)
            {
                int currentOwnerRestaurants = Math.Min(restaurantPerUser, restaurantCount - restaurantIndex);
                for (int j = 0; j < currentOwnerRestaurants; j++)
                {
                    var restaurant = restaurants[restaurantIndex];
                    var restaurantId = restaurant.Id;
                    if (j < 5)
                    {
                        //var ratings = new[] { 5, 4, 2, 3 };
                        for (int k = 0; k < userCount; k++)
                        {
                            var rating = ratings[k];
                            reviews.Add(new Review
                            {
                                UserID = usersIdList[k],
                                RestaurantID = restaurantId,
                                Rating = rating,
                                CreatedAt = DateTime.Now,
                            });

                            var reviewsOfRestaurant = reviews.Where(r => r.RestaurantID == restaurantId);
                            var average = reviewsOfRestaurant.Average(r => r.Rating);

                            restaurant.AverageRating = average;

                        }
                    }

                    restaurantIndex++;
                }
            }

            for (int i = 0; i < reviews.Count; i++)
            {
                reviews[i].ReviewID = i + 1;
                reviews[i].Comment = $"Comment {i}";
            }

            return (reviews, restaurants);
        }
    }
}
