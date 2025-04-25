using backend.Models;

namespace backend.Interfaces
{
    public interface ITableRepository
    {
        Task<List<Table>> GetAllAsync(int restaurantId);
        Task<Table?> GetByIdAsync(int restaurantId, int id);
        Task<Table> CreateAsync(Table table);
        Task<List<Table>> CreateMultipleAsync(List<Table> tables);
        Task<Table?> UpdateAsync(int restaurantId, int id, Table table);
        Task<Table?> DeleteAsync(int restaurantId, int id);
        Task DeleteTableRelatedDataAsync(int id, Table table);
    }
}
