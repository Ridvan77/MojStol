using Models;

namespace backend.Helpers.DataSeeders
{
    public static class FacilityDataSeeder
    {
        public static List<Facilities> GetFacilities()
        {
            var facilities = new List<Facilities>
            {
                new() { Name = "WiFi" },
                new() { Name = "Parking" },
                new() { Name = "View" },
                new() { Name = "Smoking" },
                new() { Name = "Entertainment" },
                new() { Name = "Bar" }
            };

            for (int i = 0; i < facilities.Count; i++)
            {
                facilities[i].FacilitiesID = i + 1;
            }

            return facilities;
        }
    }
}
