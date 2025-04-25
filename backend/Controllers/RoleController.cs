using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;
using System.Threading.Tasks;
using System.Linq;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RoleController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllRoles")]
        public async Task<ActionResult<IEnumerable<Role>>> GetAllRoles()
        {
            try
            {
                // Fetch all roles and include their associated users
                var roles = await _context.Roles
                                          .Include(r => r.Users)  // Include Users for each Role
                                          .ToListAsync();

                if (roles == null || !roles.Any())
                {
                    return NotFound("No roles found.");
                }

                return Ok(roles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("GetRoleById/{id}")]
        public async Task<ActionResult<Role>> GetRoleById(int id)
        {
            try
            {
                // Fetch the role by its ID and include associated users
                var role = await _context.Roles
                                         .Include(r => r.Users)  // Include Users for the role
                                         .FirstOrDefaultAsync(r => r.RoleID == id);

                if (role == null)
                {
                    return NotFound($"Role with ID {id} not found.");
                }

                return Ok(role);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        // GET: api/role/GetPublicRoles
        [HttpGet("GetPublicRoles")]
        public async Task<ActionResult<IEnumerable<Role>>> GetPublicRoles()
        {
            try
            {
                var roles = await _context.Roles
                                          .Where(r => r.RoleID != 1)  
                                          .Include(r => r.Users)
                                          .ToListAsync();

                if (roles == null || !roles.Any())
                {
                    return NotFound("No roles found.");
                }

                return Ok(roles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
