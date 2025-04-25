using backend.Dtos.City;
using backend.Helpers;
using backend.Interfaces;
using backend.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/cities")]
    [Authorize(Roles = "Admin")]
    public class CityController : ControllerBase
    {
        private readonly ICityRepository _cityRepo;

        public CityController(ICityRepository cityRepo)
        {
            _cityRepo = cityRepo;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cities = await _cityRepo.GetAllAsync();

            var cityList = cities.Select(c => c.ToCityDto()).ToList();

            return Ok(new PagedResult<CityDto>
            {
                Count = cities.Count,
                ResultList = cityList
            });
        }

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var city = await _cityRepo.GetByIdAsync(id);

            if (city == null)
            {
                return NotFound("City not found");
            }

            return Ok(city.ToCityDto());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CityCreateDto cityDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cityModel = cityDto.ToCityFromCreate();

            var city = await _cityRepo.CreateAsync(cityDto.ToCityFromCreate());

            if (city == null)
            {
                return NotFound("Already have city with same name");
            }

            return CreatedAtAction(nameof(GetById), new { id = city.Id }, city.ToCityDto());
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] CityUpdateDto cityDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cityModel = await _cityRepo.UpdateAsync(id, cityDto.ToCityFromUpdate());

            if (cityModel == null)
            {
                return NotFound("City not found or have already city with same name");
            }

            return Ok(cityModel.ToCityDto());
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cityModel = await _cityRepo.DeleteAsync(id);

            if (cityModel == null)
            {
                return NotFound("City does not exist");
            }

            return NoContent();
        }
    }
}
