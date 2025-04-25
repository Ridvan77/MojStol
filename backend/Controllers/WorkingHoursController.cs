using backend.Dtos.WorkingHours;
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
    public class WorkingHoursController : ControllerBase
    {
        private readonly IRestaurantRepository _restaurantRepo;
        private readonly IWorkingHoursRepository _workingHoursRepo;

        public WorkingHoursController(IRestaurantRepository restaurantRepo, IWorkingHoursRepository workingHoursRepo)
        {
            _restaurantRepo = restaurantRepo;
            _workingHoursRepo = workingHoursRepo;
        }

        [HttpGet("restaurants/{restaurantId:int}/working-hours")]
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

            var workingHours = await _workingHoursRepo.GetAllAsync(restaurantId);

            //if (workingHours == null || !workingHours.Any())
            //{
            //    return NotFound("Restaurant does not have working hours");
            //}

            var workingHoursList = workingHours.Select(wh => wh.ToWorkingHoursDto()).ToList();

            return Ok(new PagedResult<WorkingHoursDto>
            {
                Count = workingHours.Count,
                ResultList = workingHoursList
            });
        }

        [HttpPost("restaurants/{restaurantId:int}/working-hours")]
        public async Task<IActionResult> Create([FromRoute] int restaurantId, [FromBody] List<WorkingHoursCreateDto> workingHoursDto)
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

            if (workingHoursDto == null)
            {
                return BadRequest("Working hours create Dto is null");
            }

            var workingHours = await _workingHoursRepo.CreateAsync(restaurantId, [.. workingHoursDto.Select(wh => wh.ToWorkingHoursFromCreate(restaurantId))]);
            if (workingHours == null)
            {
                return BadRequest("Not all 7 days time added or not valid time or already have working hours. Start time must be earlier than end time.");
            }

            var workingHoursList = workingHours.Select(wh => wh.ToWorkingHoursDto()).ToList();

            return CreatedAtAction(nameof(GetAll), new { restaurantId }, new PagedResult<WorkingHoursDto> { Count = workingHoursList.Count, ResultList = workingHoursList });
        }

        [HttpPut("restaurants/{restaurantId:int}/working-hours")]
        public async Task<IActionResult> Update([FromRoute] int restaurantId, [FromBody] List<WorkingHoursUpdateDto> workingHoursDto)
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

            if (workingHoursDto == null)
            {
                return BadRequest("Working hours update Dto is null");
            }

            var workingHours = await _workingHoursRepo.UpdateAsync(restaurantId, workingHoursDto.Select(wh => wh.ToWorkingHoursFromUpdate(restaurantId)).ToList());

            if (workingHours == null)
            {
                return BadRequest("Not all 7 days time added or no all 7 days working hours found for the restaurant or not valid time. Start time must be earlier than end time.");
            }

            return Ok(workingHours.Select(wh => wh.ToWorkingHoursDto()).ToList());
        }

        [HttpDelete("restaurants/{restaurantId:int}/working-hours")]
        public async Task<IActionResult> Delete([FromRoute] int restaurantId)
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

            var workingHoursModel = await _workingHoursRepo.DeleteAsync(restaurantId);

            if (workingHoursModel == null)
            {
                return NotFound("No all 7 days working hours found for the restaurant.");
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
