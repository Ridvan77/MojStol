using backend.Data;
using backend.Dtos.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Interfaces;

namespace backend.Controllers
{
    [Route("api")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IRestaurantRepository _restaurantRepo;

        public UserController(ApplicationDbContext context, IRestaurantRepository restaurantRepo)
        {
            _context = context;
            _restaurantRepo = restaurantRepo;
        }

        [HttpGet("GetAllUsers")]
        public async Task<ActionResult<IEnumerable<UsersDto>>> GetAllUsers([FromQuery] string? nameSurname, [FromQuery] int? roleId)
        {
            IQueryable<User> query = _context.Users;

            if (!string.IsNullOrEmpty(nameSurname))
            {
                query = query.Where(u => u.Name.Contains(nameSurname) || u.Surname.Contains(nameSurname));
            }

            if (roleId.HasValue)
            {
                query = query.Where(u => u.RoleId == roleId.Value);
            }

            var users = await query
                .Select(u => new UsersDto
                {
                    UserId = u.UserId,
                    Name = u.Name,
                    Surname = u.Surname,
                    Email = u.Email,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    PhoneNumber = u.PhoneNumber,
                    DateOfBirth = u.DateOfBirth,
                    RoleId = u.RoleId
                })
                .ToListAsync();

            if (users == null || users.Count() == 0)
            {
                return NotFound("No users found.");
            }

            return Ok(users);
        }

        [HttpGet("GetUserById/{id}")]
        public async Task<ActionResult<UsersDto>> GetUserById(int id)
        {
            var user = await _context.Users
                .Where(u => u.UserId == id)
                .Select(u => new UsersDto
                {
                    UserId = u.UserId,
                    Name = u.Name,
                    Surname = u.Surname,
                    Email = u.Email,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    PhoneNumber = u.PhoneNumber,
                    DateOfBirth = u.DateOfBirth,
                    RoleId = u.RoleId
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }

            return Ok(user);
        }

        [HttpPut("UpdateUser/{id}")]
        public async Task<ActionResult> UpdateUser(int id, UpdateUserDto updateUserDto)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }

            user.Name = updateUserDto.Name ?? user.Name;
            user.Surname = updateUserDto.Surname ?? user.Surname;
            user.PhoneNumber = updateUserDto.PhoneNumber ?? user.PhoneNumber;
            user.DateOfBirth = updateUserDto.DateOfBirth ?? user.DateOfBirth;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Users.Any(u => u.UserId == id))
                {
                    return NotFound($"User with ID {id} not found.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("DeleteUser/{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }

            try
            {
                // Brisanje rezervacija
                var reservations = await _context.Reservations
                    .Where(r => r.UserID == id)
                    .ToListAsync();
                _context.Reservations.RemoveRange(reservations);

                // Brisanje favorita
                var favourites = await _context.Favourites
                    .Where(f => f.UserID == id)
                    .ToListAsync();
                _context.Favourites.RemoveRange(favourites);

                // Brisanje glasova na recenzijama
                var reviewVotes = await _context.ReviewVotes
                    .Where(rv => rv.UserID == id)
                    .ToListAsync();
                _context.ReviewVotes.RemoveRange(reviewVotes);

                // Brisanje ponovnih posjeta
                var visitAgains = await _context.VisitAgains
                    .Where(va => va.UserID == id)
                    .ToListAsync();
                _context.VisitAgains.RemoveRange(visitAgains);

                // Brisanje recenzija
                var reviews = await _context.Reviews
                    .Where(r => r.UserID == id)
                    .ToListAsync();
                _context.Reviews.RemoveRange(reviews);

                // Brisanje restorana gdje je korisnik vlasnik
                var ownedRestaurants = await _context.Restaurants
                    .Where(r => r.OwnerId == id)
                    .ToListAsync();
                
                foreach (var restaurant in ownedRestaurants)
                {
                    await _restaurantRepo.DeleteAsync(restaurant.Id);
                }

                // Brisanje samog korisnika
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                
                return Ok(new { message = $"User with ID {id} and all related data were successfully deleted." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the user and related data." });
            }
        }
    }
}
