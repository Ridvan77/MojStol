using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.ObjectModel;

[Route("api/[controller]")]
[ApiController]

public class VisitAgainController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public VisitAgainController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Route("api/[controller]/GetVisitAgainsByUserID")]
    public List<Restaurant?> GetVisitAgainsByUserID(int userID)
    {
        var visitAgains = _context.VisitAgains.Where(va => va.UserID == userID)
        .OrderByDescending(va => va.VisitCount).ToList();          
        List<Restaurant?> restaurants = new List<Restaurant?>();
        for (int i = 0; i < visitAgains.Count; i++)
        {
            var restaurant = _context.Restaurants.Include(r => r.RestaurantType)
                .Where(r => r.Id == visitAgains[i].RestaurantID);
            restaurants.Add(restaurant.First());
        }
        return restaurants;
    }

    [HttpGet]
    [Route("api/[controller]/GetVisitAgainsDescending")]
    public List<Restaurant?> GetVisitAgainsDescending()
    {
        var visitAgains = _context.VisitAgains.GroupBy(va => va.RestaurantID).ToList().OrderByDescending(g => g.Sum(va => va.VisitCount)).ToList();
        List<Restaurant?> restaurants = new List<Restaurant?>();
        foreach (var group in visitAgains)
        {
            var restaurant = _context.Restaurants
                .Include(r => r.RestaurantType)
                .FirstOrDefault(r => r.Id == group.Key);

            if (restaurant != null)
                restaurants.Add(restaurant);
        }
        return restaurants;
    }
}