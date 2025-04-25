using backend.Models;

namespace backend.Helpers.DataSeeders
{
    public class RestaurantPaymentMethodDataSeeder
    {
        public static List<RestaurantPaymentMethod> GetRestaurantPaymentMethod()
        {

            var restaurantPaymentMethod = new List<RestaurantPaymentMethod>
            {
                new RestaurantPaymentMethod
                {
                    RestaurantID = 1,
                    PaymentMethodID = 1,
                },
                new RestaurantPaymentMethod
                {
                    RestaurantID = 2,
                    PaymentMethodID = 2,
                },
                new RestaurantPaymentMethod
                {
                    RestaurantID = 3,
                    PaymentMethodID = 4,
                },
                new RestaurantPaymentMethod
                {
                    RestaurantID = 2,
                    PaymentMethodID = 3,
                },
                new RestaurantPaymentMethod
                {
                    RestaurantID = 4,
                    PaymentMethodID = 4,
                }
            };

            for (int i = 0; i < restaurantPaymentMethod.Count; i++)
            {
                restaurantPaymentMethod[i].PaymentMethodRestaurantId = i + 1;
                restaurantPaymentMethod[i].CreatedAt = DateTime.Now;
            }


            return restaurantPaymentMethod;
        }
  
    }
}
