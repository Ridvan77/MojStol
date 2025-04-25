using backend.Data;
using backend.Dtos.Tag;
using backend.Dtos.Tag.backend.Dtos.Tag;
using backend.Helpers;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class TagController : Controller
    {
        private readonly ApplicationDbContext _DbContext;

        public TagController(ApplicationDbContext DbContext)
        {
            _DbContext = DbContext;
        }

        // GET: api/tag/Get
        [HttpGet]
        public ActionResult<List<Tag>> GetAll()
        {
            var tags = _DbContext.Tags.Include(x=>x.RestaurantTags).ToList();

            if (tags == null || !tags.Any())
            {
                return BadRequest("No tags found.");
            }

            return Ok(tags);
        }

        // GET: api/tag/GetById/{id}
        [HttpGet("{TagId}")]
        public ActionResult<Tag> GetById(int TagId)
        {
            var tag = _DbContext.Tags
                                .Include(x => x.RestaurantTags)             
                                .FirstOrDefault(t => t.TagID == TagId);

            if (tag == null)
            {
                return NotFound("Tag not found.");
            }

            return Ok(tag);
        }

        // POST: api/tag/Insert
        [HttpPost]
        public ActionResult Insert([FromBody] TagCreateDto tagDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newTag = new Tag()
            {
                Name = tagDto.Name
            };

            _DbContext.Tags.Add(newTag);
            _DbContext.SaveChanges();

            return Ok(newTag);
        }

        // PUT: api/tag/Update
        [HttpPut]
        public ActionResult Update([FromBody] TagUpdateDto tagDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingTag = _DbContext.Tags.Find(tagDto.TagId);

            if (existingTag == null)
            {
                return NotFound("Tag not found.");
            }

            existingTag.Name = tagDto.Name;

            _DbContext.Tags.Update(existingTag);
            _DbContext.SaveChanges();

            return Ok(existingTag);
        }

        [HttpGet("{TagId}")]
        public async Task<ActionResult<int>> CheckTagUsage(int TagId)
        {
            try 
            {
                var tag = await _DbContext.Tags.FindAsync(TagId);
                if (tag == null)
                {
                    return NotFound("Tag not found.");
                }

                var usageCount = await _DbContext.RestaurantTags
                    .Where(rt => rt.TagID == TagId)
                    .CountAsync();
                
                return Ok(usageCount);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("{TagId}")]
        public async Task<ActionResult> Delete(int TagId, [FromQuery] bool forceDelete = false)
        {
            try 
            {
                var tag = await _DbContext.Tags.FindAsync(TagId);
                if (tag == null)
                {
                    return NotFound("Tag not found.");
                }

                if (!forceDelete)
                {
                    var usageCount = await _DbContext.RestaurantTags
                        .Where(rt => rt.TagID == TagId)
                        .CountAsync();
                        
                    if (usageCount > 0)
                        return BadRequest(new { message = "Tag is in use", usageCount = usageCount });
                }
                else
                {
                    var restaurantTags = await _DbContext.RestaurantTags
                        .Where(rt => rt.TagID == TagId)
                        .ToListAsync();
                        
                    _DbContext.RestaurantTags.RemoveRange(restaurantTags);
                    await _DbContext.SaveChangesAsync();
                }

                _DbContext.Tags.Remove(tag);
                await _DbContext.SaveChangesAsync();
                
                return Ok(new { message = "Tag deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
