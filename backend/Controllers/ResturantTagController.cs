using backend.Data;
using backend.Dtos.RestaurantTag;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class RestaurantTagController : Controller
    {
        private readonly ApplicationDbContext _DbContext;

        public RestaurantTagController(ApplicationDbContext DbContext)
        {
            _DbContext = DbContext;
        }

        [HttpGet]
        public ActionResult<List<RestaurantTag>> GetAll()
        {
            var restaurantTags = _DbContext.RestaurantTags
                                           .Include(rt => rt.Restaurant)
                                           .Include(rt => rt.Tag)
                                           .ToList();

            //if (restaurantTags == null || !restaurantTags.Any())
            //{
            //    return NotFound("No restaurant tags found.");
            //}

            return Ok(restaurantTags);
        }


        [HttpGet("{RestaurantTagId}")]
        public ActionResult<RestaurantTag> GetById(int RestaurantTagId)
        {
            var restaurantTag = _DbContext.RestaurantTags
                                          .Include(rt => rt.Restaurant)
                                          .Include(rt => rt.Tag)
                                          .FirstOrDefault(rt => rt.RestaurantTagId == RestaurantTagId);

            if (restaurantTag == null)
            {
                return NotFound("RestaurantTag not found.");
            }

            return Ok(restaurantTag);
        }

        [HttpPost]
        public ActionResult Insert([FromBody] RestaurantTagCreateDto restaurantTagDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newRestaurantTag = new RestaurantTag()
            {
                RestaurantId = restaurantTagDto.RestaurantID,
                TagID = restaurantTagDto.TagID,
                CreatedAt = restaurantTagDto.CreatedAt
            };

            _DbContext.RestaurantTags.Add(newRestaurantTag);
            _DbContext.SaveChanges();

            return Ok(newRestaurantTag);
        }

        [HttpPut]
        public ActionResult Update([FromBody] RestaurantTagUpdateDto restaurantTagDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingRestaurantTag = _DbContext.RestaurantTags.Find(restaurantTagDto.RestaurantTagId);

            if (existingRestaurantTag == null)
            {
                return NotFound("RestaurantTag not found.");
            }

            existingRestaurantTag.RestaurantId = restaurantTagDto.RestaurantID;
            existingRestaurantTag.TagID = restaurantTagDto.TagID;
            existingRestaurantTag.CreatedAt = restaurantTagDto.CreatedAt;

            _DbContext.RestaurantTags.Update(existingRestaurantTag);
            _DbContext.SaveChanges();

            return Ok(existingRestaurantTag);
        }


        [HttpDelete("{RestaurantTagId}")]
        public ActionResult Delete(int RestaurantTagId)
        {
            var restaurantTag = _DbContext.RestaurantTags.Find(RestaurantTagId);

            if (restaurantTag == null)
            {
                return NotFound("RestaurantTag not found.");
            }

            _DbContext.RestaurantTags.Remove(restaurantTag);
            _DbContext.SaveChanges();

            //return Ok("RestaurantTag deleted successfully.");
            return NoContent();
        }
    }
}
