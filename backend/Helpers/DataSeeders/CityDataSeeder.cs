using backend.Models;

namespace backend.Helpers.DataSeeders
{
    public static class CityDataSeeder
    {
        public static List<City> GetCities()
        {
            var cities = new List<City>
            {
                new() { Name = "Sarajevo" },
                new() { Name = "Mostar" },
                new() { Name = "Banja Luka" },
                new() { Name = "Tuzla" },
                new() { Name = "Zenica" },
                new() { Name = "Bijeljina" },
                new() { Name = "Travnik" },
                new() { Name = "Neum" },
                new() { Name = "Konjic" },
                new() { Name = "Jablanica" },
                new() { Name = "Bihać" },
                new() { Name = "Ilidža" }
            };

            for (int i = 0; i < cities.Count; i++)
            {
                cities[i].Id = i + 1;
            }

            return cities;
        }
    }
}
