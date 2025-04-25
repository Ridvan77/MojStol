using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class WorkingHoursRepository : IWorkingHoursRepository
    {
        private readonly ApplicationDbContext _context;
        public WorkingHoursRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<WorkingHours>> GetAllAsync(int restaurantId)
        {
            return await _context.WorkingHours.Where(w => w.RestaurantId == restaurantId).ToListAsync();
        }

        public async Task<List<WorkingHours>?> CreateAsync(int restaurantId, List<WorkingHours> workingHours)
        {
            if (workingHours.Count != 7)
            {
                return null;
            }

            var existingWorkingHours = await GetAllAsync(restaurantId);
            if (existingWorkingHours.Count == 7)
            {
                return null;
            }

            foreach (var wh in workingHours)
            {
                if (!IsValidWorkingHours(wh))
                {
                    return null;
                }
            }
            _context.WorkingHours.AddRange(workingHours);
            await _context.SaveChangesAsync();
            return workingHours;
        }

        private bool IsValidWorkingHours(WorkingHours wh)
        {
            if (wh.OpenTime == TimeOnly.Parse("00:00") && wh.CloseTime == TimeOnly.Parse("00:00"))
            {
                return true;
            }

            return wh.OpenTime < wh.CloseTime;
        }

        public async Task<List<WorkingHours>?> UpdateAsync(int restaurantId, List<WorkingHours> workingHours)
        {
            if (workingHours.Count != 7)
            {
                return null;
            }

            var existingWorkingHours = await GetAllAsync(restaurantId);

            if (existingWorkingHours.Count != 7)
            {
                return null;
            }

            foreach (var wh in workingHours)
            {
                var existingWh = existingWorkingHours.FirstOrDefault(e => e.Day == wh.Day);
                if (existingWh != null)
                {
                    if (!IsValidWorkingHours(wh))
                    {
                        return null;
                    }

                    bool needsUpdate = false;

                    if (existingWh.OpenTime != wh.OpenTime)
                    {
                        existingWh.OpenTime = wh.OpenTime;
                        needsUpdate = true;
                    }

                    if (existingWh.CloseTime != wh.CloseTime)
                    {
                        existingWh.CloseTime = wh.CloseTime;
                        needsUpdate = true;
                    }

                    if (existingWh.IsClosed != wh.IsClosed)
                    {
                        existingWh.IsClosed = wh.IsClosed;
                        needsUpdate = true;
                    }

                    if (needsUpdate)
                    {
                        existingWh.UpdatedAt = DateTime.UtcNow;
                    }
                }
            }

            await _context.SaveChangesAsync();
            return existingWorkingHours;
        }

        public async Task<List<WorkingHours>?> DeleteAsync(int restaurantId)
        {
            var workingHoursToDelete = await GetAllAsync(restaurantId);

            if (workingHoursToDelete.Count != 7)
            {
                return null;
            }

            _context.WorkingHours.RemoveRange(workingHoursToDelete);

            await _context.SaveChangesAsync();

            return workingHoursToDelete;
        }
    }
}