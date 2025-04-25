using backend.Dtos.Restaurant;
using backend.Helpers;
using backend.Helpers.QueryObjects;
using backend.Interfaces;
using backend.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/restaurants")]
    [Authorize(Roles = "Owner, Admin")] //Mora se unijeti Bearer <jwt logovanog usera>
    public class RestaurantController : ControllerBase
    {
        private readonly IRestaurantRepository _restaurantRepo;

        public RestaurantController(IRestaurantRepository restaurantRepo)
        {
            _restaurantRepo = restaurantRepo;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll([FromQuery] RestaurantQueryObject queryObject)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var restuarantPagedResult = await _restaurantRepo.GetAllAsync(queryObject);

            var restaurantList = restuarantPagedResult.ResultList.Select(r => r.ToRestaurantDto()).ToList();

            return Ok(new PagedResult<RestaurantDto>
            {
                Count = restuarantPagedResult.Count,
                ResultList = restaurantList
            });
        }

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var restaurant = await _restaurantRepo.GetByIdAsync(id);

            if (restaurant == null)
            {
                return NotFound("Restaurant not found");
            }

            return Ok(restaurant.ToRestaurantDto());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RestaurantCreateDto restaurantDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userRole == "Admin")
            {
                return Forbid();
            }

            if (userRole == "Owner")
            {
                if (currentUserId != restaurantDto.OwnerId.ToString())
                {
                    return Forbid();
                }
            }

            var restaurantModel = restaurantDto.ToRestaurantFromCreate();

            await _restaurantRepo.CreateAsync(restaurantModel);

            return CreatedAtAction(nameof(GetById), new { id = restaurantModel.Id }, restaurantModel.ToRestaurantDto());
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] RestaurantUpdateDto restaurantDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ownershipCheckResult = await CheckRestaurantOwnership(id);
            if (ownershipCheckResult != null)
                return ownershipCheckResult;

            var restaurantModel = await _restaurantRepo.UpdateAsync(id, restaurantDto.ToRestaurantFromUpdate());

            if (restaurantModel == null)
            {
                return NotFound("Restaurant not found");
            }

            return Ok(restaurantModel.ToRestaurantDto());
        }

        [HttpPut("{id:int}/logo")]
        public async Task<IActionResult> UpdateLogo([FromRoute] int id, [FromBody] RestaurantLogoDto restaurantLogoDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ownershipCheckResult = await CheckRestaurantOwnership(id);
            if (ownershipCheckResult != null)
                return ownershipCheckResult;

            var restaurantModel = await _restaurantRepo.UpdateLogoAsync(id, restaurantLogoDto);

            if (restaurantModel == null)
            {
                return NotFound("Restaurant not found or image format is invalid.");
            }

            return Ok(restaurantModel.ToRestaurantDto());
        }

        [HttpPut("{id:int}/location")]
        public async Task<IActionResult> UpdateLocation([FromRoute] int id, [FromBody] RestaurantLocationDto restuarantLocationModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ownershipCheckResult = await CheckRestaurantOwnership(id);
            if (ownershipCheckResult != null)
                return ownershipCheckResult;

            var restaurantModel = await _restaurantRepo.UpdateLocationAsync(id, restuarantLocationModel);

            if (restaurantModel == null)
            {
                return NotFound("Restaurant not found");
            }

            return Ok(restaurantModel.ToRestaurantDto());
        }

        [HttpDelete("{id:int}/location")]
        public async Task<IActionResult> DeleteLocation([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ownershipCheckResult = await CheckRestaurantOwnership(id);
            if (ownershipCheckResult != null)
                return ownershipCheckResult;

            var restaurantModel = await _restaurantRepo.DeleteLocationAsync(id);

            if (restaurantModel == null)
            {
                return NotFound("Restaurant not found");
            }

            return Ok(restaurantModel.ToRestaurantDto());
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ownershipCheckResult = await CheckRestaurantOwnership(id);
            if (ownershipCheckResult != null)
                return ownershipCheckResult;

            var restaurantModel = await _restaurantRepo.DeleteAsync(id);

            if (restaurantModel == null)
            {
                return NotFound("Restaurant does not exist");
            }

            return NoContent();
        }

        [HttpDelete("{id:int}/logo")]
        public async Task<IActionResult> DeleteLogo([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ownershipCheckResult = await CheckRestaurantOwnership(id);
            if (ownershipCheckResult != null)
                return ownershipCheckResult;

            var restaurantModel = await _restaurantRepo.DeleteLogoAsync(id);

            if (restaurantModel == null)
            {
                return NotFound("Restaurant does not exist");
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
