using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Dtos.Reservation;
using Microsoft.IdentityModel.Tokens;
using backend.Dtos.Favourites;

[Route("api/[controller]")]
[ApiController]
public class FavouritesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FavouritesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("GetFavouriteByUserAndRestaurant")]
    public ActionResult<Favourites> GetFavouriteByUserAndRestaurant(int userId, int restaurantId)
    {
        return _context.Favourites.Where(f => f.UserID == userId && f.RestaurantID == restaurantId).ElementAt(0);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Favourites>>> GetAllFavourites()
    {
        return await _context.Favourites.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Favourites>> GetFavourite(int id)
    {
        var favourites = await _context.Favourites.FindAsync(id);

        if (favourites == null)
        {
            return NotFound();
        }

        return favourites;
    }

    [HttpGet("GetByUserID")]
    public async Task<ActionResult<IEnumerable<Restaurant?>>> GetFavouritesByUserID(int userId)
    {
        var favouriteRestaurants = await _context.Favourites.Where(f => f.UserID == userId).Include(f => f.Restaurant)
            .ThenInclude(r => r.RestaurantType).Select(f => f.Restaurant).ToListAsync();

        if (favouriteRestaurants == null)
        {
            return NotFound();
        }

        return favouriteRestaurants;
    }

    [HttpPut]
    public async Task<IActionResult> PutFavourite(int id, FavouriteUpdateDto favouriteUpdateDto)
    {
        if (_context.Favourites.Find(id) == null)
        {
            return BadRequest(new { message = "No favourite found with this id." });
        }

        Favourites favourite = _context.Favourites.Find(id);
        
        if (favouriteUpdateDto.UserID.HasValue
            && favouriteUpdateDto.RestaurantID.HasValue)
        {
            if (_context.Favourites.ToList().Exists(f => f.UserID == favouriteUpdateDto.UserID
                && f.RestaurantID == favouriteUpdateDto.RestaurantID))
                return BadRequest(new {message = "This restaurant is already in favourites for this user!"});
            favourite.UserID = (int)favouriteUpdateDto.UserID;
            favourite.RestaurantID = (int)favouriteUpdateDto.RestaurantID;
        }

        if (favouriteUpdateDto.UserID.HasValue
            && !favouriteUpdateDto.RestaurantID.HasValue)
        {
            if (_context.Favourites.ToList().Exists(f => f.UserID == favouriteUpdateDto.UserID
                && f.RestaurantID == favourite.RestaurantID))
                return BadRequest(new { message = "This restaurant is already in favourites for this user!"});
            favourite.UserID = (int)favouriteUpdateDto.UserID;
        }

        if (!favouriteUpdateDto.UserID.HasValue
            && favouriteUpdateDto.RestaurantID.HasValue)
        {
            if (_context.Favourites.ToList().Exists(f => f.UserID == favourite.UserID
                && f.RestaurantID == favouriteUpdateDto.RestaurantID))
                return BadRequest(new { message = "This restaurant is already in favourites for this user!"});
            favourite.RestaurantID = (int)favouriteUpdateDto.RestaurantID;
        }

        _context.Entry(favourite).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!FavouriteExists(id))
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
    public async Task<ActionResult<Favourites>> PostFavourite(FavouriteCreateDto favouriteCreateDto)
    {
        if (_context.Favourites.ToList().Exists(f => f.UserID == favouriteCreateDto.UserID && 
                f.RestaurantID == favouriteCreateDto.RestaurantID))
                return BadRequest( new { message = "This restaurant is already in favourites for this user!" });

        Favourites favourite = new Favourites
        {
            FavouritesID = 0,
            UserID = favouriteCreateDto.UserID,
            RestaurantID = favouriteCreateDto.RestaurantID,
            DateAdded = favouriteCreateDto.DateAdded
        };

        _context.Favourites.Add(favourite);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAllFavourites), new { id = favourite.FavouritesID }, favourite);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFavourite(int id)
    {
        var favourite = await _context.Favourites.FindAsync(id);
        if (favourite == null)
        {
            return NotFound();
        }

        _context.Favourites.Remove(favourite);
        await _context.SaveChangesAsync();

        return NoContent();
    }


    private bool FavouriteExists(int id)
    {
        return _context.Favourites.Any(e => e.FavouritesID == id);
    }
}