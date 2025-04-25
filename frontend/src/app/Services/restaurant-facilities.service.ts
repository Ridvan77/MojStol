import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RestaurantFacility {
  restaurantFacilitiesID: number;
  restaurantID: number;
  restaurant?: any;
  facilitiesID: number;
  facilities?: any;
  dateAdded: string;
  isActive: boolean;
}

export interface RestaurantFacilityCreateDto {
  restaurantID: number;
  facilitiesID: number;
  isActive: boolean;
}

export interface RestaurantFacilityUpdateDto {
  restaurantFacilitiesID: number;
  restaurantID: number;
  facilitiesID: number;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RestaurantFacilitiesService {
  private apiUrl = 'http://localhost:5137/api/RestaurantFacilities';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RestaurantFacility[]> {
    return this.http.get<RestaurantFacility[]>(`${this.apiUrl}`);
  }

  getRestaurantFacilitiesByRestaurant(
    restaurantId: number
  ): Observable<RestaurantFacility[]> {
    return this.http.get<RestaurantFacility[]>(
      `${this.apiUrl}/RestaurantId?restaurantId=${restaurantId}`
    );
  }

  create(
    restaurantFacility: RestaurantFacilityCreateDto
  ): Observable<RestaurantFacility> {
    return this.http.post<RestaurantFacility>(
      `${this.apiUrl}`,
      restaurantFacility
    );
  }

  update(
    restaurantFacility: RestaurantFacilityUpdateDto
  ): Observable<RestaurantFacility> {
    return this.http.put<RestaurantFacility>(
      `${this.apiUrl}/${restaurantFacility.restaurantFacilitiesID}`,
      restaurantFacility
    );
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}?id=${id}`);
  }
}
