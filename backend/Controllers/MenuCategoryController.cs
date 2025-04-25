using backend.Dtos.MenuCategory;
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
    public class MenuCategoryController : ControllerBase
    {
        private readonly IMenuCategoryRepository _menuCategoryRepo;
        private readonly IRestaurantRepository _restaurantRepo;

        public MenuCategoryController(IMenuCategoryRepository menuCategoryRepo, IRestaurantRepository restaurantRepo)
        {
            _menuCategoryRepo = menuCategoryRepo;
            _restaurantRepo = restaurantRepo;
        }

        [HttpGet("restaurants/{restaurantId:int}/menu-categories")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll([FromRoute] int restaurantId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var restaurantExists = await _restaurantRepo.RestaurantExists(restaurantId);

            if (!restaurantExists)
            {
                return BadRequest("Restaurant does not exists");
            }

            var menuCategories = await _menuCategoryRepo.GetAllAsync(restaurantId);

            var menuCategoryList = menuCategories.Select(mc => mc.ToMenuCategoryDto()).ToList();

            return Ok(new PagedResult<MenuCategoryDto>
            {
                Count = menuCategoryList.Count,
                ResultList = menuCategoryList
            });
        }

        [HttpGet("restaurants/{restaurantId:int}/menu-categories/{menuCategoryId:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById([FromRoute] int restaurantId, [FromRoute] int menuCategoryId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var restaurantExists = await _restaurantRepo.RestaurantExists(restaurantId);

            if (!restaurantExists)
            {
                return BadRequest("Restaurant does not exists");
            }

            var menuCategory = await _menuCategoryRepo.GetByIdAsync(restaurantId, menuCategoryId);

            if (menuCategory == null)
            {
                return NotFound("Menu category not found for this restaurant");
            }

            return Ok(menuCategory.ToMenuCategoryDto());
        }

        [HttpPost("restaurants/{restaurantId:int}/menu-categories")]
        public async Task<IActionResult> Create([FromRoute] int restaurantId, MenuCategoryCreateDto menuCategoryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ownershipCheckResult = await CheckRestaurantOwnership(restaurantId);
            if (ownershipCheckResult != null)
                return ownershipCheckResult;

            var restaurantExists = await _restaurantRepo.RestaurantExists(restaurantId);

            if (!restaurantExists)
            {
                return BadRequest("Restaurant does not exists");
            }

            var menuCategoryModel = menuCategoryDto.ToMenuCategoryFromCreate(restaurantId);
            await _menuCategoryRepo.CreateAsync(menuCategoryModel);

            return CreatedAtAction(nameof(GetById), new { restaurantId = menuCategoryModel.RestaurantId, menuCategoryId = menuCategoryModel.Id }, menuCategoryModel.ToMenuCategoryDto());
        }

        [HttpPut("restaurants/{restaurantId:int}/menu-categories/{menuCategoryId:int}")]
        public async Task<IActionResult> Update([FromRoute] int restaurantId, [FromRoute] int menuCategoryId, [FromBody] MenuCategoryUpdateDto menuCategoryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ownershipCheckResult = await CheckRestaurantOwnership(restaurantId);
            if (ownershipCheckResult != null)
                return ownershipCheckResult;

            var restaurantExists = await _restaurantRepo.RestaurantExists(restaurantId);

            if (!restaurantExists)
            {
                return BadRequest("Restaurant does not exists");
            }

            var menuCategory = await _menuCategoryRepo.UpdateAsync(restaurantId, menuCategoryId, menuCategoryDto.ToMenuCategoryFromUpdate(restaurantId));

            if (menuCategory == null)
            {
                return NotFound("Menu category not found for this restaurant");
            }

            return Ok(menuCategory.ToMenuCategoryDto());
        }

        [HttpDelete("restaurants/{restaurantId:int}/menu-categories/{menuCategoryId:int}")]
        public async Task<IActionResult> Delete([FromRoute] int restaurantId, [FromRoute] int menuCategoryId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ownershipCheckResult = await CheckRestaurantOwnership(restaurantId);
            if (ownershipCheckResult != null)
                return ownershipCheckResult;

            var restaurantExists = await _restaurantRepo.RestaurantExists(restaurantId);

            if (!restaurantExists)
            {
                return BadRequest("Restaurant does not exists");
            }

            var menuCategoryModel = await _menuCategoryRepo.DeleteAsync(restaurantId, menuCategoryId);

            if (menuCategoryModel == null)
            {
                return NotFound("Menu category not found for this restaurant");
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
