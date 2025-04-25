using backend.Models;

namespace backend.Helpers.DataSeeders
{
    public static class ReservationDataSeeder
    {
        public static List<Reservation> GetReservations(List<Restaurant> restaurants, List<Table> tables, List<Status> statuses, List<User> users)
        {
            var reservations = new List<Reservation>();

            List<int> usersIdList = [.. users.Where(u => u.RoleId == 2).Select(u => u.UserId)];
            //List<int> usersIdList = [1, 2, 3, 8];
            int userCount = usersIdList.Count;
            int restaurantCount = restaurants.Count;
            int restaurantPerUser = (int)Math.Ceiling((double)restaurantCount / userCount);

            int restaurantIndex = 0;

            for (int i = 0; i < userCount; i++)
            {
                int currentOwnerRestaurants = Math.Min(restaurantPerUser, restaurantCount - restaurantIndex);
                for (int j = 0; j < currentOwnerRestaurants; j++)
                {
                    if (j < 5)
                    {
                        for (int k = 0; k < userCount; k++)
                        {
                            var tableId = tables.FirstOrDefault(t => t.RestaurantId == restaurants[restaurantIndex].Id)?.Id ?? 0;

                            var randomIndex = new Random().Next(0, statuses.Count);
                            var status = statuses[randomIndex];

                            reservations.Add(
                            new()
                            {
                                UserID = usersIdList[k],
                                RestaurantID = restaurants[restaurantIndex].Id,
                                TableID = tableId,
                                ReservationTime = new TimeOnly(12, 0).AddHours(k * 2),
                                NumberOfPersons = k + 1,
                                StatusID = status.StatusID,
                                CreatedAt = DateTime.Today,
                                UpdatedAt = DateTime.Today,
                                IsScanned = false
                            }
                            );
                        }
                    }

                    restaurantIndex++;
                }
            }

            int reservationCounter = 0;
            DateTime currentDate = DateTime.Today;

            for (int i = 0; i < reservations.Count; i++)
            {
                if (reservationCounter >= 3)
                {
                    currentDate = currentDate.AddDays(1);
                    reservationCounter = 0;
                }

                reservations[i].ReservationID = i + 1;
                reservations[i].Name = $"Reservation {i}";
                reservations[i].Email = "xyz@email.com";

                reservations[i].ReservationDate = DateOnly.FromDateTime(currentDate);

                reservationCounter++;
            }

            return reservations;
        }
    }
}
