using backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;

namespace backend.Helpers.DataSeeders
{
    public class RestaurantTagDataSeeder
    {
        public static List<RestaurantTag> GetRestaurantTags()
        {
            var restaurantTags = new List<RestaurantTag>
            {
                new RestaurantTag
                {
                    RestaurantId = 1,
                    TagID = 1,
                },
                new RestaurantTag
                {
                    RestaurantId = 1,
                    TagID = 2,
                },
                new RestaurantTag
                {
                    RestaurantId = 2,
                    TagID = 1,
                },
                new RestaurantTag
                {
                    RestaurantId = 3,
                    TagID = 3,
                },
                new RestaurantTag
                {
                    RestaurantId = 3,
                    TagID = 4,
                },
                new RestaurantTag
                {
                    RestaurantId = 3,
                    TagID = 5,
                },
                new RestaurantTag
                {
                    RestaurantId = 4,
                    TagID = 1,
                },
                new RestaurantTag
                {
                    RestaurantId = 4,
                    TagID = 3,
                }
            };

            for (int i = 0; i < restaurantTags.Count; i++)
            {
                restaurantTags[i].RestaurantTagId = i + 1;
                restaurantTags[i].CreatedAt = DateTime.Now;
            }

            return restaurantTags;
        }
    }    
}
