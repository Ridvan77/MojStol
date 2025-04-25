using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.RestaurantPaymentMethod
{
    public class RestaurantPaymentMethodCreateDto
    {
        [Required]
        public int RestaurantID { get; set; }

        [Required]
        public int PaymentMethodID { get; set; }
    }
}
