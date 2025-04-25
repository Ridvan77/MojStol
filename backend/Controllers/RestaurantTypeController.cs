using backend.Dtos.RestaurantType;
using backend.Helpers;
using backend.Interfaces;
using backend.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/restaurant-types")]
    [Authorize(Roles = "Admin")]
    public class RestaurantTypeController : ControllerBase
    {
        private readonly IRestaurantTypeRepository _restaurantTypeRepo;

        public RestaurantTypeController(IRestaurantTypeRepository restaurantTypeRepo)
        {
            _restaurantTypeRepo = restaurantTypeRepo;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var restaurantTypes = await _restaurantTypeRepo.GetAllAsync();

            var restaurantTypeList = restaurantTypes.Select(rt => rt.ToRestaurantTypeDto()).ToList();

            return Ok(new PagedResult<RestaurantTypeDto>
            {
                Count = restaurantTypes.Count,
                ResultList = restaurantTypeList
            });
        }

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var restaurantType = await _restaurantTypeRepo.GetByIdAsync(id);

            if (restaurantType == null)
            {
                return NotFound("Restaurant type not found");
            }

            return Ok(restaurantType.ToRestaurantTypeDto());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RestaurantTypeCreateDto restaurantTypeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var restaurantTypeModel = restaurantTypeDto.ToRestaurantTypeFromCreate();

            var restaurantType = await _restaurantTypeRepo.CreateAsync(restaurantTypeModel);

            if (restaurantType == null)
            {
                return NotFound("Already have restaurant type with same name");
            }

            return CreatedAtAction(nameof(GetById), new { id = restaurantTypeModel.Id }, restaurantTypeModel.ToRestaurantTypeDto());
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] RestaurantTypeUpdateDto restaurantTypeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var restaurantTypeModel = await _restaurantTypeRepo.UpdateAsync(id, restaurantTypeDto.ToRestaurantTypeFromUpdate());

            if (restaurantTypeModel == null)
            {
                return NotFound("Restaurant type not found or have already restaurant type with same name");
            }

            return Ok(restaurantTypeModel.ToRestaurantTypeDto());
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var restaurantTypeModel = await _restaurantTypeRepo.DeleteAsync(id);

            if (restaurantTypeModel == null)
            {
                return NotFound("Restaurant type does not exist");
            }

            return NoContent();
        }
    }
}
