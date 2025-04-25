using backend.Data;
using backend.Dtos.RestaurantSocialMedia;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using Models;
using Org.BouncyCastle.Crypto.Modes;
using Microsoft.IdentityModel.Tokens;

[Route("api/[Controller]")]
[ApiController]

public class RestaurantSocialMediaController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RestaurantSocialMediaController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RestaurantSocialMedia>>> GetRestaurantSocialMedias()
    {
        return await _context.RestaurantSocialMedias.Include(rsm => rsm.Restaurant).Include(rsm => rsm.SocialMedia)
            .ToListAsync(); 
    }

    [Route("RestaurantId")]
    [HttpGet()]
    public async Task<ActionResult<IEnumerable<RestaurantSocialMedia>>> GetRestaurantSocialMediasByRestaurantId(int restaurantId)
    {
        var restaurantSocialMedias = await _context.RestaurantSocialMedias.Include(rsm => rsm.Restaurant).Include(rsm => rsm.SocialMedia)
            .Where(rsm => rsm.RestaurantID == restaurantId)
            .ToListAsync();

        if (restaurantSocialMedias == null || restaurantSocialMedias.Count == 0)
        {
            return Ok();
        }

        return Ok(restaurantSocialMedias);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> PutRestaurantSocialMedia(int id, RestaurantSocialMediaUpdateDto restaurantSocialMediaUpdateDto)
    {
        if (_context.RestaurantSocialMedias.Find(id) == null)
        {
            return BadRequest();
        }

        RestaurantSocialMedia restaurantSocialMedia = _context.RestaurantSocialMedias.Find(id);

        if (restaurantSocialMediaUpdateDto.RestaurantID.HasValue
            && restaurantSocialMediaUpdateDto.SocialMediaID.HasValue)
        {
            if (_context.RestaurantSocialMedias.ToList().Exists(rsm => rsm.RestaurantID == restaurantSocialMediaUpdateDto.RestaurantID
                && rsm.SocialMediaID == restaurantSocialMediaUpdateDto.SocialMediaID))
                return BadRequest(new {message = "Social media already exists for this restaurant!"});
            restaurantSocialMedia.RestaurantID = (int)restaurantSocialMediaUpdateDto.RestaurantID;
            restaurantSocialMedia.SocialMediaID = (int)restaurantSocialMediaUpdateDto.SocialMediaID;
        }

        if (restaurantSocialMediaUpdateDto.RestaurantID.HasValue
            && !restaurantSocialMediaUpdateDto.SocialMediaID.HasValue)
        {
            if (_context.RestaurantSocialMedias.ToList().Exists(rsm => rsm.RestaurantID == restaurantSocialMediaUpdateDto.RestaurantID
                && rsm.SocialMediaID == restaurantSocialMedia.SocialMediaID))
                return BadRequest(new { message = "Social media already exists for this restaurant!"});
            restaurantSocialMedia.RestaurantID = (int)restaurantSocialMediaUpdateDto.RestaurantID;
        }

        if (!restaurantSocialMediaUpdateDto.RestaurantID.HasValue
            && restaurantSocialMediaUpdateDto.SocialMediaID.HasValue)
        {
            if (_context.RestaurantSocialMedias.ToList().Exists(rsm => rsm.RestaurantID == restaurantSocialMedia.RestaurantID
                && rsm.SocialMediaID == restaurantSocialMediaUpdateDto.SocialMediaID))
                return BadRequest(new { message = "Social media already exists for this restaurant!"});
            restaurantSocialMedia.SocialMediaID = (int)restaurantSocialMediaUpdateDto.SocialMediaID;
        }

        if (!restaurantSocialMediaUpdateDto.Link.IsNullOrEmpty())
        {
            restaurantSocialMedia.Link = restaurantSocialMediaUpdateDto.Link;
        }

        _context.Entry(restaurantSocialMedia).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.RestaurantSocialMedias.Any(rsm => rsm.RestaurantSocialMediaID == id))
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
    public async Task<ActionResult<RestaurantSocialMedia>> PostRestaurantSocialMedia(RestaurantSocialMediaCreateDto restaurantSocialMediaCreateDto)
    {
        if (_context.RestaurantSocialMedias.ToList().Exists(
                rsm => rsm.RestaurantID == restaurantSocialMediaCreateDto.RestaurantID && 
                rsm.SocialMediaID == restaurantSocialMediaCreateDto.SocialMediaID))
                return BadRequest("Social media already exists for this restaurant!");

        RestaurantSocialMedia restaurantSocialMedia = new RestaurantSocialMedia
        {
            RestaurantSocialMediaID = 0,
            RestaurantID = restaurantSocialMediaCreateDto.RestaurantID,
            SocialMediaID = restaurantSocialMediaCreateDto.SocialMediaID,
            Link = restaurantSocialMediaCreateDto.Link
        };

        _context.RestaurantSocialMedias.Add(restaurantSocialMedia);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRestaurantSocialMedias), new { id = restaurantSocialMedia.RestaurantSocialMediaID }, restaurantSocialMedia);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteRestaurantSocialMedia(int id)
    {
        var restaurantSocialMedia = await _context.RestaurantSocialMedias.FindAsync(id);
        if (restaurantSocialMedia == null)
            return NotFound();
        
        _context.RestaurantSocialMedias.Remove(restaurantSocialMedia);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}