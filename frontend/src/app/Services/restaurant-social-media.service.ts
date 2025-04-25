import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RestaurantSocialMedia {
  restaurantSocialMediaID: number;
  restaurantID: number;
  restaurant?: any;
  socialMediaID: number;
  socialMedia?: any;
  link: string;
}

export interface RestaurantSocialMediaCreateDto {
  restaurantID: number;
  socialMediaID: number;
  link: string;
}

export interface RestaurantSocialMediaUpdateDto {
  restaurantSocialMediaID: number;
  restaurantID: number;
  socialMediaID: number;
  link: string;
}

@Injectable({
  providedIn: 'root',
})
export class RestaurantSocialMediaService {
  private apiUrl = 'http://localhost:5137/api/RestaurantSocialMedia';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RestaurantSocialMedia[]> {
    return this.http.get<RestaurantSocialMedia[]>(`${this.apiUrl}`);
  }

  getRestaurantSocialMediaByRestaurant(
    restaurantId: number
  ): Observable<RestaurantSocialMedia[]> {
    return this.http.get<RestaurantSocialMedia[]>(
      `${this.apiUrl}/RestaurantId?restaurantId=${restaurantId}`
    );
  }

  create(
    restaurantSocialMedia: RestaurantSocialMediaCreateDto
  ): Observable<RestaurantSocialMedia> {
    return this.http.post<RestaurantSocialMedia>(
      `${this.apiUrl}`,
      restaurantSocialMedia
    );
  }

  update(
    restaurantSocialMedia: RestaurantSocialMediaUpdateDto
  ): Observable<RestaurantSocialMedia> {
    return this.http.put<RestaurantSocialMedia>(
      `${this.apiUrl}/${restaurantSocialMedia.restaurantSocialMediaID}`,
      restaurantSocialMedia
    );
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}?id=${id}`);
  }
}
