using backend.Models;

namespace backend.Interfaces
{
    public interface ICityRepository
    {
        Task<List<City>> GetAllAsync();
        Task<City?> GetByIdAsync(int id);
        Task<City?> CreateAsync(City city);
        Task<City?> UpdateAsync(int id, City city);
        Task<City?> DeleteAsync(int id);
    }
}
