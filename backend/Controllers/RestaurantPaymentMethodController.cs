using backend.Data;
using backend.Dtos.RestaurantPaymentMethod;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class RestaurantPaymentMethodController : Controller
    {
        private readonly ApplicationDbContext _DbContext;

        public RestaurantPaymentMethodController(ApplicationDbContext DbContext)
        {
            _DbContext = DbContext;
        }

        // GET: api/restaurantpaymentmethod/GetAll
        [HttpGet]
        public ActionResult<List<RestaurantPaymentMethod>> GetAll()
        {
            var paymentMethods = _DbContext.RestaurantsPaymentMethod.Include(x => x.Restaurant)
                                                                    .Include(x => x.PaymentMethod)
                                                                    .ToList();

            //if (paymentMethods == null || !paymentMethods.Any())
            //{
            //    return NotFound("No payment methods found.");
            //}

            return Ok(paymentMethods);
        }

        // GET: api/restaurantpaymentmethod/GetById/{id}
        [HttpGet("{RestaurantPaymentMethodId}")]
        public ActionResult<RestaurantPaymentMethod> GetById(int RestaurantPaymentMethodId)
        {
            var paymentMethod = _DbContext.RestaurantsPaymentMethod
                                         .Include(x => x.Restaurant)
                                         .Include(x => x.PaymentMethod)
                                         .FirstOrDefault(pm => pm.PaymentMethodRestaurantId == RestaurantPaymentMethodId);

            if (paymentMethod == null)
            {
                return NotFound("Payment method not found.");
            }

            return Ok(paymentMethod);
        }

        // POST: api/restaurantpaymentmethod/Insert
        [HttpPost]
        public ActionResult Insert([FromBody] RestaurantPaymentMethodCreateDto paymentMethodDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newPaymentMethod = new RestaurantPaymentMethod()
            {
                RestaurantID = paymentMethodDto.RestaurantID,
                PaymentMethodID = paymentMethodDto.PaymentMethodID,
                CreatedAt = DateTime.Now
            };

            _DbContext.RestaurantsPaymentMethod.Add(newPaymentMethod);
            _DbContext.SaveChanges();

            return Ok(newPaymentMethod);
        }

        // PUT: api/restaurantpaymentmethod/Update
        [HttpPut]
        public ActionResult Update([FromBody] RestaurantPaymentMethodUpdateDto paymentMethodDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingPaymentMethod = _DbContext.RestaurantsPaymentMethod.Find(paymentMethodDto.PaymentMethodRestaurantId);

            if (existingPaymentMethod == null)
            {
                return NotFound("Payment method not found.");
            }

            // Ažurira samo ako su nove vrijednosti proslijeđene
            if (paymentMethodDto.RestaurantID != 0)
            {
                existingPaymentMethod.RestaurantID = paymentMethodDto.RestaurantID;
            }

            if (paymentMethodDto.PaymentMethodID != 0)
            {
                existingPaymentMethod.PaymentMethodID = paymentMethodDto.PaymentMethodID;
            }

            existingPaymentMethod.CreatedAt = DateTime.Now;

            _DbContext.RestaurantsPaymentMethod.Update(existingPaymentMethod);
            _DbContext.SaveChanges();

            return Ok(existingPaymentMethod);
        }

        // DELETE: api/restaurantpaymentmethod/Delete/{RestaurantPaymentMethodId}
        [HttpDelete("{RestaurantPaymentMethodId}")]
        public ActionResult Delete(int RestaurantPaymentMethodId)
        {
            var paymentMethod = _DbContext.RestaurantsPaymentMethod.Find(RestaurantPaymentMethodId);

            if (paymentMethod == null)
            {
                return NotFound("Payment method not found.");
            }

            _DbContext.RestaurantsPaymentMethod.Remove(paymentMethod);
            _DbContext.SaveChanges();

            //return Ok("Payment method deleted successfully.");
            return NoContent();
        }
    }
}
