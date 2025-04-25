using backend.Dtos.RestaurantImage;
using backend.Helpers;
using backend.Interfaces;
using backend.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api")]
    [Authorize(Roles = "Owner, Admin")]
    public class RestaurantImageController : ControllerBase
    {
        private readonly IRestaurantRepository _restaurantRepo;
        private readonly IRestaurantImageRepository _restaurantImageRepo;

        public RestaurantImageController(IRestaurantRepository restaurantRepo, IRestaurantImageRepository restaurantImageRepo)
        {
            _restaurantRepo = restaurantRepo;
            _restaurantImageRepo = restaurantImageRepo;
        }

        [HttpGet("restaurants/{restaurantId:int}/restaurant-images")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll([FromRoute] int restaurantId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var restaurantExist = await _restaurantRepo.RestaurantExists(restaurantId);

            if (!restaurantExist)
            {
                return BadRequest("Restaurant does not exists");
            }

            var restaurantImages = await _restaurantImageRepo.GetAllAsync(restaurantId);

            //if (restaurantImages == null || !restaurantImages.Any())
            //{
            //    return NotFound("Restaurant does not have images");
            //}

            var restaurantImageList = restaurantImages.Select(ri => ri.ToRestaurantImageDto()).ToList();

            return Ok(new PagedResult<RestaurantImageDto>
            {
                Count = restaurantImages.Count,
                ResultList = restaurantImageList
            });
        }

        [HttpPost("restaurants/{restaurantId:int}/restaurant-images")]
        public async Task<IActionResult> Create([FromRoute] int restaurantId, [FromBody] List<RestaurantImageCreateDto> restaurantImagesDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ownershipCheckResult = await CheckRestaurantOwnership(restaurantId);
            if (ownershipCheckResult != null)
                return ownershipCheckResult;

            var restaurantExist = await _restaurantRepo.RestaurantExists(restaurantId);

            if (!restaurantExist)
            {
                return BadRequest("Restaurant does not exists");
            }

            if (restaurantImagesDto == null)
            {
                return BadRequest("Working hours create Dto is null");
            }

            var restaurantImages = await _restaurantImageRepo.CreateAsync(restaurantId, restaurantImagesDto);
            var restaurantImageList = restaurantImages.Select(ri => ri.ToRestaurantImageDto()).ToList();

            return CreatedAtAction(nameof(GetAll), new { restaurantId }, new PagedResult<RestaurantImageDto> { Count = restaurantImages.Count, ResultList = restaurantImageList });
        }

        [HttpDelete("restaurants/{restaurantId:int}/restaurant-images")]
        public async Task<IActionResult> Delete([FromRoute] int restaurantId, [FromBody] List<int> imageIds)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ownershipCheckResult = await CheckRestaurantOwnership(restaurantId);
            if (ownershipCheckResult != null)
                return ownershipCheckResult;

            var restaurantExist = await _restaurantRepo.RestaurantExists(restaurantId);

            if (!restaurantExist)
            {
                return BadRequest("Restaurant does not exists");
            }

            var workingHoursModel = await _restaurantImageRepo.DeleteAsync(restaurantId, imageIds);

            if (workingHoursModel == null)
            {
                return NotFound("No images found for the restaurant.");
            }

            return NoContent();
        }

        private async Task<IActionResult?> CheckRestaurantOwnership(int restaurantId)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var restaurant = await _restaurantRepo.GetByIdAsync(restaurantId);
            if (restaurant != null)
            {
                if (userRole == "Owner")
                {
                    if (currentUserId != restaurant.OwnerId.ToString())
                    {
                        return Forbid();
                    }
                }
            }

            return null;
        }
    }
}
