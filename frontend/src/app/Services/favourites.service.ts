import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

export interface Favourite {
  favouritesID: number;
  userID: number;
  user: any;
  restaurantID: number;
  restaurant: any;
  dateAdded: number;
}

export interface FavouriteUpdateDto {
  userID: number | null;
  restaurantID: number | null;
}

export interface FavouriteCreateDto {
  userID: number;
  restaurantID: number;
}

export interface Restaurant {
  id: string;
  logoUrl: string;
  name: string;
  description: string;
  contactNumber: string;
  contactEmail: string;
  street: string;
  ownerId: number;
  cityId: number;
  restaurantTypeId: number;
  city: any;
  restaurantType: any;
  webSite: string | null;
  averageRating: number;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root',
})
export class FavouritesService {
  http = inject(HttpClient);

  getAllFavourites() {
    const apiUrl = `http://localhost:5137/api/Favourites`;
    return this.http.get<Favourite[]>(apiUrl);
  }

  getFavouritesByUserID(userId: number | null = null) {
    var apiUrl = `http://localhost:5137/api/Favourites/GetByUserID?userId=${userId}`;
    return this.http.get<Restaurant[]>(apiUrl);
  }

  getFavouriteByUserAndRestaurant(userId: number, restaurantId: number) {
    var apiUrl = `http://localhost:5137/api/Favourites/GetFavouriteByUserAndRestaurant?`;
    if (userId != null) apiUrl += `userId=${userId}&`;
    if (restaurantId != null) apiUrl += `restaurantId=${restaurantId}&`;
    return this.http.get<Favourite>(apiUrl);
  }

  deleteFavourite(id: number) {
    const apiUrl = `http://localhost:5137/api/Favourites/${id}`;
    return this.http.delete(apiUrl);
  }

  addFavourite(favouriteDto: FavouriteCreateDto) {
    const apiUrl = `http://localhost:5137/api/Favourites`;
    return this.http.post(apiUrl, favouriteDto);
  }
}
