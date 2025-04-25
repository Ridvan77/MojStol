using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class TableRepository : ITableRepository
    {
        private readonly ApplicationDbContext _context;
        public TableRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Table>> GetAllAsync(int restaurantId)
        {
            return await _context.Tables.Where(t => t.RestaurantId == restaurantId).ToListAsync();
        }

        public async Task<Table?> GetByIdAsync(int restaurantId, int id)
        {
            return await _context.Tables
                .FirstOrDefaultAsync(t => t.RestaurantId == restaurantId && t.Id == id);
        }

        public async Task<Table> CreateAsync(Table table)
        {
            _context.Tables.Add(table);
            await _context.SaveChangesAsync();
            return table;
        }

        public async Task<List<Table>> CreateMultipleAsync(List<Table> tables)
        {
            await _context.Tables.AddRangeAsync(tables);
            await _context.SaveChangesAsync();
            return tables;
        }

        public async Task<Table?> UpdateAsync(int restaurantId, int id, Table table)
        {
            var existingTable = await GetByIdAsync(restaurantId, id);
            if (existingTable == null) return null;

            existingTable.TableNumber = table.TableNumber;
            existingTable.Seats = table.Seats;
            existingTable.IsFunctional = table.IsFunctional;
            existingTable.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return existingTable;
        }

        public async Task<Table?> DeleteAsync(int restaurantId, int id)
        {
            var tableModel = await GetByIdAsync(restaurantId, id);
            if (tableModel == null) return null;

            await DeleteTableRelatedDataAsync(id, tableModel);

            await _context.SaveChangesAsync();

            return tableModel;
        }

        public async Task DeleteTableRelatedDataAsync(int tableId, Table table)
        {
            // Reservations
            var reservations = _context.Reservations.Where(r => r.TableID == tableId);
            if (await reservations.AnyAsync())
            {
                _context.Reservations.RemoveRange(reservations);
            }

            _context.Tables.Remove(table);

            // Save changes for all the deletions
            //await _context.SaveChangesAsync();
        }
    }
}