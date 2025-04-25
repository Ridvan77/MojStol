using backend.Data;
using backend.Dtos.RestaurantFacility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using Models;
using Org.BouncyCastle.Crypto.Modes;

[Route("api/[Controller]")]
[ApiController]

public class RestaurantFacilitiesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RestaurantFacilitiesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RestaurantFacilities>>> GetRestaurantFacilities()
    {
        return await _context.RestaurantFacilities.Include(rf => rf.Restaurant).Include(rf => rf.Facilities)
            .ToListAsync(); 
    }

    [Route("RestaurantId")]
    [HttpGet()]
    public async Task<ActionResult<IEnumerable<RestaurantFacilities>>> GetRestaurantFacilitiesByRestaurantId(int restaurantId)
    {
        var restaurantFacilities = await _context.RestaurantFacilities.Include(rf => rf.Restaurant).Include(rf => rf.Facilities)
            .Where(rf => rf.RestaurantID == restaurantId)
            .ToListAsync();

        if (restaurantFacilities == null || restaurantFacilities.Count == 0)
        {
            return Ok();
        }

        return Ok(restaurantFacilities);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> PutRestaurantFacility(int id, RestaurantFacilityUpdateDto restaurantFacilityUpdateDto)
    {
        if (_context.RestaurantFacilities.Find(id) == null)
        {
            return BadRequest();
        }

        RestaurantFacilities restaurantFacilitiy = _context.RestaurantFacilities.Find(id);

        if (restaurantFacilityUpdateDto.RestaurantID.HasValue
            && restaurantFacilityUpdateDto.FacilitiesID.HasValue)
        {
            if (_context.RestaurantFacilities.ToList().Exists(rf => rf.RestaurantID == restaurantFacilityUpdateDto.RestaurantID
                && rf.FacilitiesID == restaurantFacilityUpdateDto.FacilitiesID))
                return BadRequest(new {message = "Facility already exists for this restaurant!"});
            restaurantFacilitiy.RestaurantID = (int)restaurantFacilityUpdateDto.RestaurantID;
            restaurantFacilitiy.FacilitiesID = (int)restaurantFacilityUpdateDto.FacilitiesID;
        }

        if (restaurantFacilityUpdateDto.RestaurantID.HasValue
            && !restaurantFacilityUpdateDto.FacilitiesID.HasValue)
        {
            if (_context.RestaurantFacilities.ToList().Exists(rf => rf.RestaurantID == restaurantFacilityUpdateDto.RestaurantID
                && rf.FacilitiesID == restaurantFacilitiy.FacilitiesID))
                return BadRequest(new { message = "Facility already exists for this restaurant!"});
            restaurantFacilitiy.RestaurantID = (int)restaurantFacilityUpdateDto.RestaurantID;
        }

        if (!restaurantFacilityUpdateDto.RestaurantID.HasValue
            && restaurantFacilityUpdateDto.FacilitiesID.HasValue)
        {
            if (_context.RestaurantFacilities.ToList().Exists(rf => rf.RestaurantID == restaurantFacilitiy.RestaurantID
                && rf.FacilitiesID == restaurantFacilityUpdateDto.FacilitiesID))
                return BadRequest(new { message = "Facility already exists for this restaurant!"});
            restaurantFacilitiy.FacilitiesID = (int)restaurantFacilityUpdateDto.FacilitiesID;
        }

        if (restaurantFacilityUpdateDto.IsActive.HasValue)
        {
            restaurantFacilitiy.IsActive = (bool)restaurantFacilityUpdateDto.IsActive;
        }

        _context.Entry(restaurantFacilitiy).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.RestaurantFacilities.Any(rf => rf.RestaurantFacilitiesID == id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    [HttpPost]
    public async Task<ActionResult<RestaurantFacilities>> PostRestaurantFacility(RestaurantFacilityCreateDto restaurantFacilityCreateDto)
    {
        if (_context.RestaurantFacilities.ToList().Exists(
                rf => rf.RestaurantID == restaurantFacilityCreateDto.RestaurantID && 
                rf.FacilitiesID == restaurantFacilityCreateDto.FacilitiesID))
                return BadRequest("Facility already exists for this restaurant!");

        RestaurantFacilities restaurantFacility = new RestaurantFacilities
        {
            RestaurantFacilitiesID = 0,
            RestaurantID = restaurantFacilityCreateDto.RestaurantID,
            FacilitiesID = restaurantFacilityCreateDto.FacilitiesID,
            DateAdded = DateTime.Now,
            IsActive = restaurantFacilityCreateDto.IsActive
        };

        _context.RestaurantFacilities.Add(restaurantFacility);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRestaurantFacilities), new { id = restaurantFacility.RestaurantFacilitiesID }, restaurantFacility);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteRestaurantFacility(int id)
    {
        var restaurantFacility = await _context.RestaurantFacilities.FindAsync(id);
        if (restaurantFacility == null)
            return NotFound();
        
        _context.RestaurantFacilities.Remove(restaurantFacility);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}