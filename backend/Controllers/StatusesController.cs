using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;


[Route("api/[controller]")]
[ApiController]
public class StatusesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public StatusesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Status>>> GetStatuses()
    {
        return await _context.Statuses.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Status>> GetStatus(int id)
    {
        var status = await _context.Statuses.FindAsync(id);

        if (status == null)
        {
            return NotFound();
        }

        return status;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutStatus(int id, Status status)
    {
        if (id != status.StatusID)
        {
            return BadRequest();
        }

        _context.Entry(status).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!StatusExists(id))
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
    public async Task<ActionResult<Status>> PostStatus(Status status)
    {
        _context.Statuses.Add(status);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetStatus), new { id = status.StatusID }, status);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStatus(int id)
    {
        var status = await _context.Statuses.FindAsync(id);
        if (status == null)
        {
            return NotFound();
        }

        _context.Statuses.Remove(status);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool StatusExists(int id)
    {
        return _context.Statuses.Any(e => e.StatusID == id);
    }
}