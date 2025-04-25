using Models;

namespace backend.Helpers.DataSeeders
{
    public class RestaurantSocialMediaDataSeeder
    {
        public static List<RestaurantSocialMedia> GetRestaurantSocialMedias()
        {
            var restaurantSocialMedias = new List<RestaurantSocialMedia>
            {
                new ()
                {
                    RestaurantID = 1,
                    SocialMediaID = 1,
                    Link = "www.facebook.com"
                },
                new ()
                {
                    RestaurantID = 1,
                    SocialMediaID = 2,
                    Link = "www.instagram.com"
                },
                new ()
                {
                    RestaurantID = 2,
                    SocialMediaID = 1,
                    Link = "www.facebook.com"
                },
                new ()
                {
                    RestaurantID = 3,
                    SocialMediaID = 1,
                    Link = "www.facebook.com"
                },
                new ()
                {
                    RestaurantID = 3,
                    SocialMediaID = 2,
                    Link = "www.instagram.com"
                },
                new ()
                {
                    RestaurantID = 3,
                    SocialMediaID = 3,
                    Link = "www.tiktok.com"
                },
                new ()
                {
                    RestaurantID = 4,
                    SocialMediaID = 1,
                    Link = "www.facebook.com"
                },
                new ()
                {
                    RestaurantID = 4,
                    SocialMediaID = 3,
                    Link = "www.instagram.com"
                }
            };

            for (int i = 0; i < restaurantSocialMedias.Count; i++)
            {
                restaurantSocialMedias[i].RestaurantSocialMediaID = i + 1;
            }

            return restaurantSocialMedias;
        }
    }
}
