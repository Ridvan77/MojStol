using backend.Models;

namespace backend.Interfaces
{
    public interface IWorkingHoursRepository
    {
        Task<List<WorkingHours>> GetAllAsync(int restaurantId);
        Task<List<WorkingHours>?> CreateAsync(int restaurantId, List<WorkingHours> workingHours);
        Task<List<WorkingHours>?> UpdateAsync(int restaurantId, List<WorkingHours> workingHours);
        Task<List<WorkingHours>?> DeleteAsync(int restaurantId);
    }
}
