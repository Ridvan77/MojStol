using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class PaymentMethod
    {
        [Key]
        public int PaymentMethodID { get; set; }
        public string Name { get; set; }

        public ICollection<RestaurantPaymentMethod> RestaurantPaymentMethod { get; set; } = new List<RestaurantPaymentMethod>();
    }
}
