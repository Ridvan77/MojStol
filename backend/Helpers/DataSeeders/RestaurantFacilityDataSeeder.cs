using Models;

namespace backend.Helpers.DataSeeders
{
    public class RestaurantFacilityDataSeeder
    {
        public static List<RestaurantFacilities> GetRestaurantFacilities()
        {
            var restaurantFacilities = new List<RestaurantFacilities>
            {
                new ()
                {
                    RestaurantID = 1,
                    FacilitiesID = 1,
                },
                new ()
                {
                    RestaurantID = 1,
                    FacilitiesID = 2,
                },
                new ()
                {
                    RestaurantID = 2,
                    FacilitiesID = 1,
                },
                new ()
                {
                    RestaurantID = 3,
                    FacilitiesID = 3,
                },
                new ()
                {
                    RestaurantID = 3,
                    FacilitiesID = 4,
                },
                new ()
                {
                    RestaurantID = 3,
                    FacilitiesID = 5,
                },
                new ()
                {
                    RestaurantID = 4,
                    FacilitiesID = 1,
                },
                new ()
                {
                    RestaurantID = 4,
                    FacilitiesID = 3,
                }
            };

            for (int i = 0; i < restaurantFacilities.Count; i++)
            {
                restaurantFacilities[i].RestaurantFacilitiesID = i + 1;
                restaurantFacilities[i].IsActive = true;
                restaurantFacilities[i].DateAdded = DateTime.Now;
            }

            return restaurantFacilities;
        }
    }
}
