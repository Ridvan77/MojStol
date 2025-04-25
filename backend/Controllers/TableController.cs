using backend.Dtos.Table;
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
    public class TableController : ControllerBase
    {
        private readonly ITableRepository _tableRepo;
        private readonly IRestaurantRepository _restaurantRepo;

        public TableController(ITableRepository tableRepo, IRestaurantRepository restaurantRepo)
        {
            _tableRepo = tableRepo;
            _restaurantRepo = restaurantRepo;
        }

        [HttpGet("restaurants/{restaurantId:int}/tables")]
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

            var tables = await _tableRepo.GetAllAsync(restaurantId);

            var tableList = tables.Select(t => t.ToTableDto()).ToList();

            return Ok(new PagedResult<TableDto>
            {
                Count = tables.Count,
                ResultList = tableList
            });
        }

        [HttpGet("restaurants/{restaurantId:int}/tables/{tableId:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById([FromRoute] int restaurantId, [FromRoute] int tableId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var restaurantExists = await _restaurantRepo.RestaurantExists(restaurantId);

            if (!restaurantExists)
            {
                return BadRequest("Restaurant does not exists");
            }

            var table = await _tableRepo.GetByIdAsync(restaurantId, tableId);

            if (table == null)
            {
                return BadRequest("Table not exist or not from this restaurant");
            }

            return Ok(table.ToTableDto());
        }

        [HttpPost("restaurants/{restaurantId:int}/tables")]
        public async Task<IActionResult> Create([FromRoute] int restaurantId, List<TableCreateDto> tablesDto)
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

            if (tablesDto == null)
            {
                return BadRequest("Tables Dto is null");
            }

            var tables = await _tableRepo.CreateMultipleAsync([.. tablesDto.Select(t => t.ToTableFromCreate(restaurantId))]);
            var tableList = tables.Select(t => t.ToTableDto()).ToList();

            return CreatedAtAction(nameof(GetAll), new { restaurantId }, new PagedResult<TableDto> { Count = tables.Count, ResultList = tableList });
        }

        [HttpPut("restaurants/{restaurantId:int}/tables/{tableId:int}")]
        public async Task<IActionResult> Update([FromRoute] int restaurantId, [FromRoute] int tableId, [FromBody] TableUpdateDto tableDto)
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

            var table = await _tableRepo.UpdateAsync(restaurantId, tableId, tableDto.ToTableFromUpdate(restaurantId));

            if (table == null)
            {
                return BadRequest("Table not found or not from this restaurant");
            }

            return Ok(table.ToTableDto());
        }

        [HttpDelete("restaurants/{restaurantId:int}/tables/{tableId:int}")]
        public async Task<IActionResult> Delete([FromRoute] int restaurantId, [FromRoute] int tableId)
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

            var tableModel = await _tableRepo.DeleteAsync(restaurantId, tableId);

            if (tableModel == null)
            {
                return BadRequest("Table does not exist or not from this restaurant");
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
