using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
        public class RestaurantPaymentMethod
        {
            [Key]
            public int PaymentMethodRestaurantId { get; set; }

            [ForeignKey(nameof(Restaurant))]
            public int RestaurantID { get; set; }

            [JsonIgnore] // Avoid circular reference with Restaurant
            public Restaurant? Restaurant { get; set; }

            [ForeignKey(nameof(PaymentMethod))]
            public int PaymentMethodID { get; set; }

            [JsonIgnore] // Avoid circular reference with PaymentMethod
            public PaymentMethod? PaymentMethod { get; set; }

            public DateTime CreatedAt { get; set; }
        }
}
