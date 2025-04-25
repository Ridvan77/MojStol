using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Dtos.SocialMedia;
using Models;

[Route("api/[controller]")]
[ApiController]
public class SocialMediaController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SocialMediaController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SocialMedia>>> GetAllSocialMedias()
    {
        return await _context.SocialMedias.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SocialMedia>> GetSocialMedia(int id)
    {
        var socialMedia = await _context.SocialMedias.FindAsync(id);

        if (socialMedia == null)
        {
            return NotFound();
        }

        return socialMedia;
    }

    [HttpPost]
    public async Task<ActionResult<SocialMedia>> PostSocialMedia(SocialMediaCreateDto socialMediaCreateDto)
    {
        if (_context.SocialMedias.ToList().Exists(sm => sm.Name.ToLower() == socialMediaCreateDto.Name.ToLower()))
                return BadRequest("This social media already exists!");

        SocialMedia socialMedia = new SocialMedia
        {
            SocialMediaID = 0,
            Name = socialMediaCreateDto.Name
        };

        _context.SocialMedias.Add(socialMedia);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAllSocialMedias), new { id = socialMedia.SocialMediaID }, socialMedia);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSocialMedia(int id)
    {
        var socialMedia = await _context.SocialMedias.FindAsync(id);
        if (socialMedia == null)
        {
            return NotFound();
        }

        var restaurantSocialMedia = await _context.RestaurantSocialMedias.Where(rsm => rsm.SocialMediaID == id).ToListAsync();
        if (restaurantSocialMedia.Count() > 0)
        {
            _context.RestaurantSocialMedias.RemoveRange(restaurantSocialMedia);
            await _context.SaveChangesAsync();
        }

        _context.SocialMedias.Remove(socialMedia);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}