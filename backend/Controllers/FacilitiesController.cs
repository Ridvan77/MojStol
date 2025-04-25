using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Dtos.Facilities;
using Models;

[Route("api/[controller]")]
[ApiController]
public class FacilitiesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FacilitiesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Facilities>>> GetAllFacilities()
    {
        return await _context.Facilities.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Facilities>> GetFacility(int id)
    {
        var facility = await _context.Facilities.FindAsync(id);

        if (facility == null)
        {
            return NotFound();
        }

        return facility;
    }

    [HttpPost]
    public async Task<ActionResult<Facilities>> PostFacility(FacilityCreateDto facilityCreateDto)
    {
        if (_context.Facilities.ToList().Exists(f => f.Name.ToLower() == facilityCreateDto.Name.ToLower()))
                return BadRequest("This facility already exists!");

        Facilities facility = new Facilities
        {
            FacilitiesID = 0,
            Name = facilityCreateDto.Name
        };

        _context.Facilities.Add(facility);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAllFacilities), new { id = facility.FacilitiesID }, facility);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFacility(int id)
    {
        var facility = await _context.Facilities.FindAsync(id);
        if (facility == null)
        {
            return NotFound();
        }

        var restaurantFacilities = await _context.RestaurantFacilities.Where(rf => rf.FacilitiesID == id).ToListAsync();
        if (restaurantFacilities.Count() > 0)
        {
            _context.RestaurantFacilities.RemoveRange(restaurantFacilities);
            await _context.SaveChangesAsync();
        }

        _context.Facilities.Remove(facility);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}