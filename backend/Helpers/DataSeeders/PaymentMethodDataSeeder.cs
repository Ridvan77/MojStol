using backend.Models;

namespace backend.Helpers.DataSeeders
{
    public class PaymentMethodDataSeeder
    {
        public static List<PaymentMethod> GetPaymentMethods()
        {
            var paymentMethods = new List<PaymentMethod>
            {
                new PaymentMethod  { Name = "Cash" },
                new PaymentMethod  { Name = "Debit Card" },
                new PaymentMethod  { Name = "Credit Card" },
                new PaymentMethod  { Name = "Bitcoin" },
                new PaymentMethod  { Name = "American Express" }
            };

            for (int i = 0; i < paymentMethods.Count; i++)
            {
                paymentMethods[i].PaymentMethodID = i + 1;
            }

            return paymentMethods;
        }
    }
}
