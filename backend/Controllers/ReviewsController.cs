using backend.Data;
using backend.Dtos.Review;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using Google.Type;

[Route("api/[controller]")]
[ApiController]
public class ReviewsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IRestaurantRepository _restaurantRepo;

    public ReviewsController(ApplicationDbContext context, IRestaurantRepository restaurantRepo)
    {
        _context = context;
        _restaurantRepo = restaurantRepo;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
    {
        return await _context.Reviews.ToListAsync();
    }
    
    [Route("restaurantId")]
    [HttpGet()]
    public async Task<ActionResult<IEnumerable<Review>>> GetReviewsByRestaurant(int restaurantId)
    {
        var reviews = await _context.Reviews.Include(r => r.User)
            .Where(r => r.RestaurantID == restaurantId)
            .ToListAsync();

        if (reviews == null || reviews.Count == 0)
        {
            return NotFound(new { message = "No reviews found for this restaurant." });
        }

        return Ok(reviews);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Review>> GetReview(int id)
    {
        var review = await _context.Reviews.FindAsync(id);

        if (review == null)
        {
            return NotFound();
        }

        return review;
    }

    [HttpPost]
    public async Task<ActionResult<Review>> PostReview(ReviewCreateDto reviewCreateDto)
    {
        if (_context.Reservations.Where(r => r.UserID == reviewCreateDto.UserID &&
            r.RestaurantID == reviewCreateDto.RestaurantID).Count() == 0)
            return BadRequest(new { message = "You didn't make any reservations for this restaurant!"});

        var reservationsCount = _context.Reservations.Where(r => r.UserID == reviewCreateDto.UserID &&
            r.RestaurantID == reviewCreateDto.RestaurantID &&
            r.ReservationDate <= DateOnly.FromDateTime(reviewCreateDto.CreatedAt)).Count();
        var reviewsCount = _context.Reviews.Where(r => r.UserID == reviewCreateDto.UserID &&
            r.RestaurantID == reviewCreateDto.RestaurantID).Count();
        if (reviewsCount >= reservationsCount)
            return BadRequest(new { message = "You already reviewed this restaurant for every reservation you had!"});

        var reservations = _context.Reservations.Where(r => r.UserID == reviewCreateDto.UserID &&
            r.RestaurantID == reviewCreateDto.RestaurantID &&
            r.ReservationDate <= DateOnly.FromDateTime(reviewCreateDto.CreatedAt)).ToList();
        
        var reservation = reservations[0];
        for (int i = 1; i < reservations.Count(); i++)
        {
            if (reservations[i].ReservationDate > reservation.ReservationDate)
                reservation = reservations[i];
        }
        
        if (DateOnly.FromDateTime(reviewCreateDto.CreatedAt) < reservation.ReservationDate)
            return BadRequest(new { message = "You can't leave a review before taking a reservation!"});
        else if (DateOnly.FromDateTime(reviewCreateDto.CreatedAt) >= reservation.ReservationDate.AddDays(3))
            return BadRequest(new { message = "You can't leave a review 3 days after taking a reservation!"});
        else if (DateOnly.FromDateTime(reviewCreateDto.CreatedAt) == reservation.ReservationDate && 
                TimeOnly.FromDateTime(reviewCreateDto.CreatedAt) < reservation.ReservationTime.AddHours(3))
            return BadRequest(new { message = "You can't leave a review before 3 hours after taking a reservation!"});

        Review review = new Review{
            ReviewID = 0,
            UserID = reviewCreateDto.UserID,
            RestaurantID = reviewCreateDto.RestaurantID,
            Rating = reviewCreateDto.Rating,
            Comment = reviewCreateDto.Comment,
            CreatedAt = reviewCreateDto.CreatedAt
        };
        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        // ovo sam dodao umjesto ono not mapped, jer onako svaki put radi query kad dobavlja rating
        var restaurantModel = await _restaurantRepo.GetByIdAsync(review.RestaurantID);
        if (restaurantModel != null)
        {
            restaurantModel.AverageRating = await _context.Reviews.
                Where(r => r.RestaurantID == review.RestaurantID).
                AverageAsync(r => r.Rating);
            _context.Entry(restaurantModel).State = EntityState.Modified;
        }

        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetReview), new { id = review.ReviewID }, review);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null)
        {
            return NotFound();
        }

        var reviewVotes = await _context.ReviewVotes.Where(rv => rv.ReviewID == review.ReviewID).ToListAsync();
        _context.ReviewVotes.RemoveRange(reviewVotes);

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ReviewExists(int id)
    {
        return _context.Reviews.Any(e => e.ReviewID == id);
    }
}
