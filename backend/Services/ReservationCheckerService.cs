using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Org.BouncyCastle.Asn1.Cms;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class ReservationCheckerService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ReservationCheckerService> _logger;

    public ReservationCheckerService(IServiceScopeFactory scopeFactory, ILogger<ReservationCheckerService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("ReservationCheckerService is starting.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                    var now = DateTime.UtcNow.AddHours(1).AddMinutes(7);

                    var expiredReservations = await dbContext.Reservations
                        .Where(r => !r.IsScanned &&
                            r.ReservationDate == DateOnly.FromDateTime(now) &&
                            TimeOnly.FromDateTime(now) > r.ReservationTime.AddMinutes(20)
                            && r.StatusID == 2)
                        .ToListAsync();                    

                    foreach (var reservation in expiredReservations)
                    {
                        reservation.StatusID = 3;

                        var user = await dbContext.Users.FindAsync(reservation.UserID);
                        if (user != null)
                        {
                            var userReservations = await dbContext.Reservations.Where(
                                r => r.UserID == user.UserId
                            ).ToListAsync();

                            var userVisitAgains = await dbContext.VisitAgains.Where(
                                va => va.UserID == user.UserId
                            ).ToListAsync();

                            var userReviews = await dbContext.Reviews.Where(
                                r => r.UserID == user.UserId
                            ).ToListAsync();

                            var userReviewVotes = await dbContext.ReviewVotes.Where(
                                rV => rV.UserID == user.UserId ||
                                rV.Review.UserID == user.UserId
                            ).ToListAsync();

                            var userFavourites = await dbContext.Favourites.Where(
                                f => f.UserID == user.UserId
                            ).ToListAsync();

                            user.BlacklistCounter += 1;
                            if (user.BlacklistCounter >= 3)
                            {
                                dbContext.ReviewVotes.RemoveRange(userReviewVotes);
                                dbContext.SaveChanges();
                                dbContext.VisitAgains.RemoveRange(userVisitAgains);
                                dbContext.SaveChanges();
                                dbContext.Favourites.RemoveRange(userFavourites);
                                dbContext.SaveChanges();
                                dbContext.Reviews.RemoveRange(userReviews);
                                dbContext.SaveChanges();
                                dbContext.Reservations.RemoveRange(userReservations);
                                dbContext.SaveChanges();
                                dbContext.Users.Remove(user);
                            }
                        }

                        _logger.LogInformation($"Reservation {reservation.ReservationID} canceled, time {reservation.ReservationTime}, now {TimeOnly.FromDateTime(now)} user {reservation.UserID} blacklisted.");
                    }

                    await dbContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in ReservationCheckerService: {ex.Message}");
            }

            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
        }
    }
}
