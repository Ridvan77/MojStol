using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using QRCoder;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using backend.Models;
using backend.Dtos.Reservation;
using Microsoft.IdentityModel.Tokens;
using Models;
using Microsoft.OpenApi.Extensions;
using QRCoder.Extensions;
using Org.BouncyCastle.Crypto.Engines;

[Route("api/[controller]")]
[ApiController]
public class ReservationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;
    private readonly QRCodeService _qrCodeService;

    public ReservationsController(ApplicationDbContext context, IEmailService emailService, QRCodeService qrCodeService)
    {
        _context = context;
        _emailService = emailService;
        _qrCodeService = qrCodeService ?? throw new ArgumentNullException(nameof(qrCodeService));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations()
    {
        return await _context.Reservations.ToListAsync();
    }

    [HttpGet]
    [Route("/GetReservationByFilters")]
    public async Task<ActionResult<IEnumerable<Reservation>>> GetReservationByFilters(int? id, [FromQuery] int? restaurantId, [FromQuery] string? nameSurname, [FromQuery] int? ownerId, [FromQuery] DateOnly? dateFrom, [FromQuery] DateOnly? dateTo, [FromQuery] int? userId)
    {
        var reservations = _context.Reservations.Include(r => r.Restaurant).Include(r => r.User).Include(r => r.Status).AsQueryable();
        
        if (id.HasValue)
            reservations = reservations.Where(r => r.ReservationID == id);
        if (restaurantId.HasValue)
            reservations = reservations.Where(r => r.RestaurantID == restaurantId);
        if (!nameSurname.IsNullOrEmpty())
            reservations = reservations.Where(r => r.Name.Contains(nameSurname));
        if (userId.HasValue)
            reservations = reservations.Where(r => r.UserID== userId);
        if (ownerId.HasValue)
            reservations = reservations.Where(r => r.Restaurant.OwnerId == ownerId);
        if (dateFrom.HasValue)
            reservations = reservations.Where(r => r.ReservationDate >= dateFrom);
        if (dateTo.HasValue)
            reservations = reservations.Where(r => r.ReservationDate <= dateTo);

        return await reservations.ToListAsync();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutReservation(int id, ReservationUpdateDto reservationUpdateDto)
    {
        if (_context.Reservations.Find(id) == null)
        {
            return BadRequest(new { message = "No reservation found with this id." });
        }

        Reservation reservation = _context.Reservations.Find(id);
        
        var visitAgain = await _context.VisitAgains
        .FirstOrDefaultAsync(v => v.UserID == reservation.UserID && v.RestaurantID == reservation.RestaurantID);
        
        if (reservationUpdateDto.UserID.HasValue && !reservationUpdateDto.RestaurantID.HasValue)
        {
            visitAgain.VisitCount--;
            if (visitAgain.VisitCount == 0)
                _context.VisitAgains.Remove(visitAgain);
            else   
                _context.VisitAgains.Update(visitAgain);

            if (_context.VisitAgains.ToList().Exists(v => v.UserID == reservationUpdateDto.UserID && v.RestaurantID == reservation.RestaurantID))
            {
                var newVisitAgain = await _context.VisitAgains
                .FirstOrDefaultAsync(v => v.UserID == reservationUpdateDto.UserID && v.RestaurantID == reservation.RestaurantID);
                newVisitAgain.VisitCount++;
                _context.VisitAgains.Update(newVisitAgain);
            }
            else
            {
                var newVisitAgain = new VisitAgain
                {
                    UserID = (int)reservationUpdateDto.UserID,
                    RestaurantID = reservation.RestaurantID,
                    VisitCount = 1
                };
                _context.VisitAgains.Add(newVisitAgain);
            }

            reservation.UserID = (int)reservationUpdateDto.UserID;
        }
            
        if (reservationUpdateDto.RestaurantID.HasValue && !reservationUpdateDto.UserID.HasValue)
        {
            visitAgain.VisitCount--;
            if (visitAgain.VisitCount == 0)
                _context.VisitAgains.Remove(visitAgain);
            else   
                _context.VisitAgains.Update(visitAgain);

            if (_context.VisitAgains.ToList().Exists(v => v.UserID == reservation.UserID && v.RestaurantID == reservationUpdateDto.RestaurantID))
            {
                var newVisitAgain = await _context.VisitAgains
                .FirstOrDefaultAsync(v => v.UserID == reservation.UserID && v.RestaurantID == reservationUpdateDto.RestaurantID);
                newVisitAgain.VisitCount++;
                _context.VisitAgains.Update(newVisitAgain);
            }
            else
            {
                var newVisitAgain = new VisitAgain
                {
                    UserID = reservation.UserID,
                    RestaurantID = (int)reservationUpdateDto.RestaurantID,
                    VisitCount = 1
                };
                _context.VisitAgains.Add(newVisitAgain);
            }
            
            reservation.RestaurantID = (int)reservationUpdateDto.RestaurantID;
        }

        if (reservationUpdateDto.UserID.HasValue && reservationUpdateDto.RestaurantID.HasValue)
        {
            visitAgain.VisitCount--;
            if (visitAgain.VisitCount == 0)
                _context.VisitAgains.Remove(visitAgain);
            else   
                _context.VisitAgains.Update(visitAgain);

            if (_context.VisitAgains.ToList().Exists(v => v.UserID == reservationUpdateDto.UserID && v.RestaurantID == reservationUpdateDto.RestaurantID))
            {
                var newVisitAgain = await _context.VisitAgains
                .FirstOrDefaultAsync(v => v.UserID == reservationUpdateDto.UserID && v.RestaurantID == reservationUpdateDto.RestaurantID);
                newVisitAgain.VisitCount++;
                _context.VisitAgains.Update(newVisitAgain);
            }
            else
            {
                var newVisitAgain = new VisitAgain
                {
                    UserID = (int)reservationUpdateDto.UserID,
                    RestaurantID = (int)reservationUpdateDto.RestaurantID,
                    VisitCount = 1
                };
                _context.VisitAgains.Add(newVisitAgain);
            }
            
            reservation.UserID = (int)reservationUpdateDto.UserID;
            reservation.RestaurantID = (int)reservationUpdateDto.RestaurantID;
        }
            
        if (reservationUpdateDto.TableID.HasValue)
            reservation.TableID = (int)reservationUpdateDto.TableID;
            
        if (!reservationUpdateDto.Name.IsNullOrEmpty())
            reservation.Name = reservationUpdateDto.Name;
            
        if (reservationUpdateDto.ReservationDate.HasValue)
            reservation.ReservationDate = (DateOnly)reservationUpdateDto.ReservationDate;
            
        if (reservationUpdateDto.ReservationTime.HasValue)
            reservation.ReservationTime = (TimeOnly)reservationUpdateDto.ReservationTime;
            
        if (!reservationUpdateDto.Email.IsNullOrEmpty())
            reservation.Email = reservationUpdateDto.Email;
            
        if (reservationUpdateDto.NumberOfPersons.HasValue)
            reservation.NumberOfPersons = (int)reservationUpdateDto.NumberOfPersons;
            
        if (reservationUpdateDto.StatusID.HasValue)
            reservation.StatusID = (int)reservationUpdateDto.StatusID;
            
        if (reservationUpdateDto.UpdatedAt.HasValue)
            reservation.UpdatedAt = (DateTime)reservationUpdateDto.UpdatedAt;
            
        _context.Entry(reservation).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ReservationExists(id))
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
    public async Task<ActionResult<Reservation>> PostReservation([FromBody] ReservationCreateDto reservationCreateDto)
    {
        var reservations = _context.Reservations.Where(r => r.UserID == reservationCreateDto.UserID &&
            r.RestaurantID == reservationCreateDto.RestaurantID).ToList();
        
        for (int i = 0; i < reservations.Count(); i++)
        {
            if (reservationCreateDto.ReservationDate == reservations[i].ReservationDate)
                return BadRequest(new { message = "You can't make a reservation on the same date as your previous one!" });
        }
        if (reservationCreateDto.ReservationDate <= DateOnly.FromDateTime(DateTime.Now))
            return BadRequest(new { message = "You can't make a reservation for today or earlier!" });

        if (!_context.WorkingHours.Where(wh => wh.RestaurantId == reservationCreateDto.RestaurantID &&
                wh.Day == reservationCreateDto.ReservationDate.DayOfWeek &&
                !wh.IsClosed).Any())
                {
                    return BadRequest(new { message = "You can't make a reservation because a restaurant is closed that day!" });
                }
        else if (!_context.WorkingHours.Where(wh => wh.RestaurantId == reservationCreateDto.RestaurantID &&
                    wh.Day == reservationCreateDto.ReservationDate.DayOfWeek && 
                    wh.OpenTime.AddHours(1) <= reservationCreateDto.ReservationTime &&
                    wh.CloseTime.AddHours(-2) >= reservationCreateDto.ReservationTime).Any())
                    {
                        return BadRequest(new { message = "You can't make a reservation in that particular time!" });
                    }

        var possibleTables = _context.Tables.Where(t => t.RestaurantId == reservationCreateDto.RestaurantID &&
             t.Seats >= reservationCreateDto.NumberOfPersons).ToList();
        var reservationsInSameTimeWithSameOrHigherNumberOfPersons = _context.Reservations.Where(r => r.RestaurantID == reservationCreateDto.RestaurantID
            && r.ReservationDate == reservationCreateDto.ReservationDate &&
            r.ReservationTime.IsBetween(reservationCreateDto.ReservationTime.AddHours(-2), reservationCreateDto.ReservationTime.AddHours(2))
            && r.NumberOfPersons >= reservationCreateDto.NumberOfPersons).ToList();
        if (possibleTables.Count() > reservationsInSameTimeWithSameOrHigherNumberOfPersons.Count())
        {
            foreach (var table in possibleTables)
            {
                bool isAccepted = true;
                foreach (var reservation1 in reservationsInSameTimeWithSameOrHigherNumberOfPersons)
                {
                    if (table.Id == reservation1.TableID)
                    {
                        isAccepted = false;
                        break;
                    }
                }
                if (isAccepted)
                {
                    reservationCreateDto.TableID = table.Id;
                    break;
                }
            }
        }
        else
            return BadRequest(new { message = "There are no available seats at that time!" });

        Reservation reservation = new Reservation{
            ReservationID = 0,
            UserID = reservationCreateDto.UserID,
            RestaurantID = reservationCreateDto.RestaurantID,
            TableID = reservationCreateDto.TableID,
            Name = reservationCreateDto.Name,
            ReservationDate = reservationCreateDto.ReservationDate,
            ReservationTime = reservationCreateDto.ReservationTime,
            Email = reservationCreateDto.Email,
            NumberOfPersons = reservationCreateDto.NumberOfPersons,
            StatusID = reservationCreateDto.StatusID,
            CreatedAt = reservationCreateDto.CreatedAt
        };

        _context.Reservations.Add(reservation);
        _context.SaveChanges();

        if (!string.IsNullOrEmpty(reservation.Email))
        {
            var restaurant = _context.Restaurants.Find(reservation.RestaurantID);
            string reservationData = $"{reservation.ReservationID}";
            
            byte[] qrCodeBytes = _qrCodeService.GenerateQRCode(reservationData);
            
            string subject = $"Potvrda rezervacije - {restaurant.Name}";
            string message = $@"
                <h2>Poštovani {reservation.Name},</h2>
                <p>Hvala vam na rezervaciji u {restaurant.Name}.</p>
                <p>Detalji rezervacije:</p>
                <ul>
                    <li>Datum: {reservation.ReservationDate.ToShortDateString()}</li>
                    <li>Vrijeme: {reservation.ReservationTime}</li>
                    <li>Broj gostiju: {reservation.NumberOfPersons}</li>
                </ul>
                <p>Molimo vas da pokažete ovaj QR kod pri dolasku:</p>
                <img src='cid:qrcode' alt='QR Code'/>
                <p>Radujemo se vašem dolasku!</p>";

            await _emailService.SendEmailAsync(reservation.Email, subject, message, qrCodeBytes, "qrcode.png");
        }

        await _context.SaveChangesAsync();

        return CreatedAtAction("GetReservationByFilters", new { id = reservation.ReservationID }, reservation);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReservation(int id)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null)
        {
            return NotFound();
        }

        var visitAgain = await _context.VisitAgains
        .FirstOrDefaultAsync(v => v.UserID == reservation.UserID && v.RestaurantID == reservation.RestaurantID);
        if (visitAgain != null)
        {
            visitAgain.VisitCount--;
            _context.VisitAgains.Update(visitAgain);
            if (visitAgain.VisitCount == 0)
                _context.VisitAgains.Remove(visitAgain);
        }
        _context.Reservations.Remove(reservation);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ReservationExists(int id)
    {
        return _context.Reservations.Any(e => e.ReservationID == id);
    }

    [Route("scanQrCode")]
    [HttpPut]
    public async Task<IActionResult> ScanQrCode([FromBody] ScanRequest request)
    {
        var reservation = await _context.Reservations.Include(r => r.Restaurant).Where(r => r.ReservationID == request.ReservationID).FirstAsync();
        if (reservation.IsScanned)
            return BadRequest(new { message = "Reservation is already scanned!" });

        if (request == null)
            return BadRequest(new { message = "Request is invalid" });

        else if (request.ReservationID <= 0)
            return BadRequest(new { message = "ReservationID is invalid" + reservation });

        else if (request.OwnerID <= 0)
            return BadRequest(new { message = "OwnerID is invalid" + reservation });
        
        if (reservation.Restaurant.OwnerId != request.OwnerID)
            return Unauthorized(new { message = "This restaurant is not authorized to scan this reservation." });

        var visitAgain = await _context.VisitAgains
        .FirstOrDefaultAsync(v => v.UserID == reservation.UserID && v.RestaurantID == reservation.RestaurantID);

        if (visitAgain == null)
        {
            visitAgain = new VisitAgain{
                UserID = reservation.UserID,
                RestaurantID = reservation.RestaurantID,
                VisitCount = 1
            };
            _context.VisitAgains.Add(visitAgain);
        }
        else
        {
            visitAgain.VisitCount++;
            _context.VisitAgains.Update(visitAgain);
        }

        reservation.IsScanned = true;
        await _context.SaveChangesAsync();

        return Ok("Reservation successfully scanned.");
    }
}
