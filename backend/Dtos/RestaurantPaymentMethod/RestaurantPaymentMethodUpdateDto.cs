using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.RestaurantPaymentMethod
{
    public class RestaurantPaymentMethodUpdateDto
    {
        [Required]
        public int PaymentMethodRestaurantId { get; set; }

        [Required]
        public int RestaurantID { get; set; }

        [Required]
        public int PaymentMethodID { get; set; }
    }
}
