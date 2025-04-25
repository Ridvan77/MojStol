using backend.Models;

namespace backend.Helpers.DataSeeders
{
    public static class TableDataSeeder
    {
        public static List<Table> GetTables(List<Restaurant> restaurants)
        {
            List<(int, int)> tablesCapacities = [(15, 4), (10, 6), (5, 8)];
            var tables = new List<Table>();

            for (int i = 0; i < restaurants.Count; i++)
            {

                for (int j = 0; j < tablesCapacities.Count; j++)
                {
                    for (int k = 0; k < tablesCapacities[j].Item1; k++)
                    {

                        tables.Add(
                        new()
                        {
                            RestaurantId = restaurants[i].Id,
                            Seats = tablesCapacities[j].Item2,
                            TableNumber = (tables.Count % 30) + 1
                        });
                    }
                }
            }

            for (int i = 0; i < tables.Count; i++)
            {
                tables[i].Id = i + 1;
            }
            return tables;
        }
    }
}
