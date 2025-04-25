using backend.Models;

namespace backend.Helpers.DataSeeders
{
    public static class RestaurantTypeDataSeeder
    {
        public static List<RestaurantType> GetRestaurantTypes()
        {
            var restaurantTypes = new List<RestaurantType>
            {
                new(){ Name ="Bosanska kuhinja"},
                new(){ Name ="Kineska"},
                new(){ Name ="Talijanska"},
                new(){ Name ="Indijska"},
                new(){ Name ="FastFood"},
                new(){ Name ="Morski plodovi"},
                new(){ Name ="Internacionalna"},
            };

            for (int i = 0; i < restaurantTypes.Count; i++)
            {
                restaurantTypes[i].Id = i + 1;
            }
            return restaurantTypes;
        }
    }
}
