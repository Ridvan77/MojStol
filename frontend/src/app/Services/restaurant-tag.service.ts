import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RestaurantTag {
  restaurantTagId: number;
  restaurantId: number;
  tagID: number;
  createdAt: Date;
  restaurant?: any;
  tag?: any;
}

export interface RestaurantTagCreateDto {
  restaurantID: number;
  tagID: number;
}

interface RestaurantTagUpdateDto {
  restaurantTagId: number;
  restaurantID: number;
  tagID: number;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class RestaurantTagService {
  private apiUrl = `http://localhost:5137/api/RestaurantTag`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<RestaurantTag[]> {
    return this.http.get<RestaurantTag[]>(`${this.apiUrl}/GetAll`);
  }

  getById(id: number): Observable<RestaurantTag> {
    return this.http.get<RestaurantTag>(`${this.apiUrl}/GetById/${id}`);
  }

  create(restaurantTag: RestaurantTagCreateDto): Observable<RestaurantTag> {
    return this.http.post<RestaurantTag>(
      `${this.apiUrl}/Insert`,
      restaurantTag
    );
  }

  update(restaurantTag: RestaurantTagUpdateDto): Observable<RestaurantTag> {
    return this.http.put<RestaurantTag>(`${this.apiUrl}/Update`, restaurantTag);
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/Delete/${id}`);
  }
}
