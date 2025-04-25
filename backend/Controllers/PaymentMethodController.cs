using backend.Data;
using backend.Dtos.PaymentMethod;
using backend.Helpers;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentMethodController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public PaymentMethodController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public ActionResult<List<PaymentMethod>> GetAll()
        {
            var paymentMethods = _dbContext.PaymentMethods.ToList();
            return Ok(paymentMethods);
        }

        [HttpGet("{id}")]
        public ActionResult<PaymentMethod> GetById(int id)
        {
            var paymentMethod = _dbContext.PaymentMethods
                                          .Include(p => p.RestaurantPaymentMethod)
                                          .FirstOrDefault(p => p.PaymentMethodID == id);

            if (paymentMethod == null)
            {
                return NotFound();
            }

            return Ok(paymentMethod);
        }

        [HttpPost]
        public ActionResult<PaymentMethod> Create([FromBody] PaymentMethodCreateDto dto)
        {
            var paymentMethod = new PaymentMethod
            {
                Name = dto.Name
            };

            _dbContext.PaymentMethods.Add(paymentMethod);
            _dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = paymentMethod.PaymentMethodID }, paymentMethod);
        }

        [HttpPut("{id}")]
        public ActionResult<PaymentMethod> Update(int id, [FromBody] PaymentMethodUpdateDto dto)
        {
            var paymentMethod = _dbContext.PaymentMethods.FirstOrDefault(p => p.PaymentMethodID == id);

            if (paymentMethod == null)
            {
                return NotFound();
            }

            paymentMethod.Name = dto.Name;
            _dbContext.SaveChanges();

            return Ok(paymentMethod);
        }

        [HttpGet("checkPaymentMethodUsage/{id}")]
        public ActionResult<bool> CheckPaymentMethodUsage(int id)
        {
            var isUsed = _dbContext.RestaurantsPaymentMethod
                                  .Any(rpm => rpm.PaymentMethodID == id);
            
            return Ok(isUsed);
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var paymentMethod = _dbContext.PaymentMethods.Find(id);

            if (paymentMethod == null)
            {
                return NotFound("Payment method not found.");
            }

            // Prvo provjerimo da li se koristi
            var isUsed = _dbContext.RestaurantsPaymentMethod
                                  .Any(rpm => rpm.PaymentMethodID == id);

            if (isUsed)
            {
                // Ako se koristi, prvo obrišimo sve veze
                var restaurantPaymentMethods = _dbContext.RestaurantsPaymentMethod
                                                       .Where(rpm => rpm.PaymentMethodID == id);
                _dbContext.RestaurantsPaymentMethod.RemoveRange(restaurantPaymentMethods);
            }

            // Zatim obrišimo payment method
            _dbContext.PaymentMethods.Remove(paymentMethod);
            _dbContext.SaveChanges();

            return NoContent();
        }
    }
}
