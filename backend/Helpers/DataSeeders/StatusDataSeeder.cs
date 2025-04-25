using backend.Models;

namespace backend.Helpers.DataSeeders
{
    public static class StatusDataSeeder
    {
        public static List<Status> GetStatuses()
        {
            var statuses = new List<Status>();

            for (int i = 0; i < 3; i++)
            {
                statuses.Add(
                    new()
                    {
                        StatusID = i + 1,
                        Name = (ReservationStatus)i + 1
                    });
            }

            return statuses;
        }
    }
}
