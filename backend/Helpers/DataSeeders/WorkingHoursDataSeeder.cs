using backend.Models;

namespace backend.Helpers.DataSeeders
{
    public static class WorkingHoursDataSeeder
    {
        public static List<WorkingHours> GetWorkingHours(List<Restaurant> restaurants)
        {
            var restaurantsWorkingHours = new List<WorkingHours>();

            for (int i = 0; i < restaurants.Count; i++)
            {
                TimeOnly openTime;
                TimeOnly closeTime;
                bool isClosed;
                if (i % 3 == 0)
                {
                    openTime = new TimeOnly(8, 0);
                    closeTime = new TimeOnly(23, 0);
                }
                else if (i % 3 == 1)
                {
                    openTime = new TimeOnly(9, 0);
                    closeTime = new TimeOnly(22, 0);
                }
                else
                {
                    openTime = new TimeOnly(7, 0);
                    closeTime = new TimeOnly(22, 0);
                }
                for (int j = 0; j < 7; j++)
                {
                    //Izmijenjeno tako da nijedan restoran ne radi nedjeljom
                    isClosed = j == 0;
                    restaurantsWorkingHours.Add(
                    new WorkingHours
                    {
                        Day = (DayOfWeek)j,
                        OpenTime = openTime,
                        CloseTime = closeTime,
                        IsClosed = isClosed,
                        RestaurantId = restaurants[i].Id
                    });
                }
            }

            for (int i = 0; i < restaurantsWorkingHours.Count; i++)
            {
                restaurantsWorkingHours[i].Id = i + 1;
            }

            return restaurantsWorkingHours;
        }
    }
}
