using backend.Dtos.MenuItem;
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
    public class MenuItemController : ControllerBase
    {
        private readonly IMenuItemRepository _menuItemRepo;
        private readonly IRestaurantRepository _restaurantRepo;
        private readonly IMenuCategoryRepository _menuCategoryRepository;

        public MenuItemController(IMenuItemRepository menuItemRepo, IRestaurantRepository restaurantRepo, IMenuCategoryRepository menuCategoryRepository)
        {
            _menuItemRepo = menuItemRepo;
            _restaurantRepo = restaurantRepo;
            _menuCategoryRepository = menuCategoryRepository;
        }

        [HttpGet("restaurants/{restaurantId:int}/menu-items")]
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

            var MenuItems = await _menuItemRepo.GetAllAsync(restaurantId);

            var MenuItemList = MenuItems.Select(mi => mi.ToMenuItemDto()).ToList();
            return Ok(new PagedResult<MenuItemDto>
            {
                Count = MenuItemList.Count,
                ResultList = MenuItemList
            });
        }

        [HttpGet("restaurants/{restaurantId:int}/menu-items/{menuItemId:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById([FromRoute] int restaurantId, [FromRoute] int menuItemId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var restaurantExists = await _restaurantRepo.RestaurantExists(restaurantId);

            if (!restaurantExists)
            {
                return BadRequest("Restaurant does not exists");
            }

            var menuItem = await _menuItemRepo.GetByIdAsync(restaurantId, menuItemId);

            if (menuItem == null)
            {
                return NotFound("Restaurant does not have menu category of this menu item or menu item not found");
            }

            return Ok(menuItem.ToMenuItemDto());
        }

        [HttpPost("restaurants/{restaurantId:int}/menu-items")]
        public async Task<IActionResult> Create([FromRoute] int restaurantId, MenuItemCreateDto menuItemDto)
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

            var menuCategory = await _menuCategoryRepository.GetByIdAsync(restaurantId, menuItemDto.MenuCategoryId);

            if (menuCategory == null)
            {
                return BadRequest("Restaurant does not have menu category of this menu item");
            }

            var menuItemModel = menuItemDto.ToMenuItemFromCreate();
            await _menuItemRepo.CreateAsync(menuItemModel);

            return CreatedAtAction(nameof(GetById), new { restaurantId, menuItemId = menuItemModel.Id }, menuItemModel.ToMenuItemDto());
        }

        [HttpPut("restaurants/{restaurantId:int}/menu-items/{menuItemId:int}")]
        public async Task<IActionResult> Update([FromRoute] int restaurantId, [FromRoute] int menuItemId, [FromBody] MenuItemUpdateDto menuItemDto)
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

            var menuItem = await _menuItemRepo.UpdateAsync(restaurantId, menuItemId, menuItemDto.ToMenuItemFromUpdate());

            if (menuItem == null)
            {
                return NotFound("Restaurant does not have menu category of this menu item or menu item not found");
            }

            return Ok(menuItem.ToMenuItemDto());
        }

        [HttpDelete("restaurants/{restaurantId:int}/menu-items/{menuItemId:int}")]
        public async Task<IActionResult> Delete([FromRoute] int restaurantId, [FromRoute] int menuItemId)
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

            var menuItemModel = await _menuItemRepo.DeleteAsync(restaurantId, menuItemId);

            if (menuItemModel == null)
            {
                return NotFound("Restaurant does not have menu category of this menu item or menu item not found");
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
