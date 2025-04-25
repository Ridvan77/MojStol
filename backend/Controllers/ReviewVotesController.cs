using backend.Data;
using backend.Dtos.ReviewVotes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

[Route("api/[Controller]")]
[ApiController]

public class ReviewVotesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReviewVotesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReviewVotes>>> GetReviewVotes()
    {
        return await _context.ReviewVotes.Include(rv => rv.User).Include(rv => rv.Review)
            .ToListAsync(); 
    }

    [Route("reviewId")]
    [HttpGet()]
    public async Task<ActionResult<IEnumerable<ReviewVotes>>> GetReviewVotesByReview(int reviewId)
    {
        var reviewVotes = await _context.ReviewVotes.Include(r => r.User).Include(r => r.Review)
            .Where(r => r.ReviewID == reviewId)
            .ToListAsync();

        if (reviewVotes == null || reviewVotes.Count == 0)
        {
            return Ok();
        }

        return Ok(reviewVotes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ReviewVotes>> GetReviewVote(int id)
    {
        var reviewVote = await _context.ReviewVotes.FindAsync(id);

        if (reviewVote == null)
        {
            return NotFound();
        }

        return reviewVote;
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ReviewVotes>> PutReviewVote(int id, ReviewVotesUpdateDto reviewVotesUpdateDto)
    {
        if (_context.ReviewVotes.Find(id) == null)
        {
            return BadRequest();
        }

        ReviewVotes reviewVote = _context.ReviewVotes.Find(id);

        if (reviewVotesUpdateDto.UserID.HasValue && !reviewVotesUpdateDto.ReviewID.HasValue)
        {
            if (_context.ReviewVotes.ToList().Exists(rv => rv.UserID == reviewVotesUpdateDto.UserID &&
                rv.ReviewID == reviewVote.ReviewID && rv.IsLike == reviewVotesUpdateDto.IsLike))
                return BadRequest( new { message = "ReviewVote already exists!" });
            reviewVote.UserID = (int)reviewVotesUpdateDto.UserID;
        }
        
        if (reviewVotesUpdateDto.ReviewID.HasValue && !reviewVotesUpdateDto.UserID.HasValue)
        {
            if (_context.ReviewVotes.ToList().Exists(rv => rv.ReviewID == reviewVotesUpdateDto.ReviewID &&
                rv.UserID == reviewVote.UserID && rv.IsLike == reviewVotesUpdateDto.IsLike))
                return BadRequest( new { message = "ReviewVote already exists!" });
            reviewVote.ReviewID = (int)reviewVotesUpdateDto.ReviewID;
        }

        if (reviewVotesUpdateDto.ReviewID.HasValue && reviewVotesUpdateDto.UserID.HasValue)
        {
            if (_context.ReviewVotes.ToList().Exists(rv => rv.UserID == reviewVotesUpdateDto.UserID &&
                rv.ReviewID == reviewVotesUpdateDto.ReviewID && rv.IsLike == reviewVotesUpdateDto.IsLike))
                return BadRequest( new { message = "ReviewVote already exists!" });
            reviewVote.UserID = (int)reviewVotesUpdateDto.UserID;
            reviewVote.ReviewID = (int)reviewVotesUpdateDto.ReviewID;
        }

        if (reviewVotesUpdateDto.IsLike.HasValue)
            reviewVote.IsLike = (bool)reviewVotesUpdateDto.IsLike;
        
        _context.Entry(reviewVote).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.ReviewVotes.Any(e => e.ReviewVotesID == id))
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
    public async Task<ActionResult<ReviewVotes>> PostReviewVote(ReviewVotesCreateDto reviewCreateDto)
    {
        if (_context.ReviewVotes.ToList().Exists(rv => rv.UserID == reviewCreateDto.UserID && 
                rv.ReviewID == reviewCreateDto.ReviewID))
                return BadRequest( new { message = "ReviewVote already exists!" });

        ReviewVotes reviewVotes = new ReviewVotes
        {
            ReviewVotesID = 0,
            UserID = reviewCreateDto.UserID,
            ReviewID = reviewCreateDto.ReviewID,
            IsLike = reviewCreateDto.IsLike
        };

        _context.ReviewVotes.Add(reviewVotes);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetReviewVotes), new { id = reviewVotes.ReviewID }, reviewVotes);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteReviewVotes(int id)
    {
        var reviewVotes = await _context.ReviewVotes.FindAsync(id);
        if (reviewVotes == null)
            return NotFound();
        
        _context.ReviewVotes.Remove(reviewVotes);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}