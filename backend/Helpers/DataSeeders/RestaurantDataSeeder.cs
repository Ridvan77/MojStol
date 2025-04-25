using backend.Models;

namespace backend.Helpers.DataSeeders
{
    public static class RestaurantDataSeeder
    {
        public static List<Restaurant> GetRestaurants(List<RestaurantType> restaurantsTypes, List<User> users)
        {
            var restaurants = new List<Restaurant>();
            for (int i = 0; i < restaurantsTypes.Count; i++)
            {
                restaurants.AddRange(
                [
                    new()
                    {
                        Name = "Ćevabdžinica Željo",
                        Description = "Smještena u srcu Baščaršije, poznata je po autentičnim sarajevskim ćevapima s dugogodišnjom tradicijom.",
                        ContactNumber = "+387 33 445 555",
                        ContactEmail = "info@zeljo.ba",
                        WebSite = "www.zeljo.ba",
                        CityId = 1, // Sarajevo
                        RestaurantTypeId = i+1,
                        Street = "Babića Mahala 1"
                    },
                    new()
                    {
                        Name = "Restoran Kibe Mahala",
                        Description = "Smješten na padinama Sarajeva, nudi spektakularan pogled na grad, posebno u večernjim satima.",
                        ContactNumber = "+387 33 666 666",
                        ContactEmail = "info@kibemahala.ba",
                        WebSite = "www.kibemahala.ba",
                        CityId = 1, // Sarajevo
                        RestaurantTypeId = i+1,
                        Street = "Kibe Mahala 11"
                    },
                    new()
                    {
                        Name = "Restoran Zdrava Voda",
                        Description = "Poznat po svojoj dugogodišnjoj tradiciji, smješten uz magistralni put, pruža autentično bosansko gastronomsko iskustvo.",
                        ContactNumber = "+387 36 555 555",
                        ContactEmail = "info@zdravavoda.ba",
                        WebSite = "www.zdravavoda.ba",
                        CityId = 10, // Jablanica
                        RestaurantTypeId = i+1,
                        Street = "Magistralni put M-17"
                    },
                    new()
                    {
                        Name = "Restoran Maksumić",
                        Description = "Poznat po bogatoj ponudi jela s roštilja i tradicionalnih bosanskih specijaliteta, smješten u srcu Jablanice.",
                        ContactNumber = "+387 36 666 666",
                        ContactEmail = "kontakt@maksumic.ba",
                        WebSite = "www.maksumic.ba",
                        CityId = 10, // Jablanica
                        RestaurantTypeId = i+1,
                        Street = "Jablanica 123"
                    },
                    new()
                    {
                        Name = "Ćevabdžinica Hari",
                        Description = "Poznata po sočnim i ukusnim ćevapima, smještena u Travniku, pruža autentično iskustvo.",
                        ContactNumber = "+387 30 511 727",
                        ContactEmail = "info@cevabdzinicahari.ba",
                        WebSite = "www.cevabdzinicahari.ba",
                        CityId = 7, // Travnik
                        RestaurantTypeId = i+1,
                        Street = "Travnik 45"
                    },
                    new()
                    {
                        Name = "Čaršijska Česma",
                        Description = "Pruža jedinstven doživljaj bosanske tradicije s raznim tradicionalnim jelima, bosanskom kafom i domaćim kolačima.",
                        ContactNumber = "+387 35 257 400",
                        ContactEmail = "kontakt@carsijskacesma.ba",
                        WebSite = "www.carsijskacesma.ba",
                        CityId = 4, // Tuzla
                        RestaurantTypeId = i+1,
                        Street = "Tuzlanska Čaršija"
                    }
                ]);
            }

            List<int> ownersIdList = [.. users.Where(u => u.RoleId == 3).Select(u => u.UserId)];
            //List<int> ownersIdList = [4, 5, 6, 9];
            int ownerCount = ownersIdList.Count;
            int restaurantCount = restaurants.Count;
            int restaurantsPerOwner = (int)Math.Ceiling((double)restaurantCount / ownerCount);

            int restaurantIndex = 0;

            for (int i = 0; i < ownerCount; i++)
            {
                int currentOwnerRestaurants = Math.Min(restaurantsPerOwner, restaurantCount - restaurantIndex);
                for (int j = 0; j < currentOwnerRestaurants; j++)
                {
                    restaurants[restaurantIndex].Id = restaurantIndex + 1;
                    restaurants[restaurantIndex].OwnerId = ownersIdList[i];
                    restaurantIndex++;
                }
            }

            return restaurants;
        }
    }
}
