import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RestaurantPaymentMethod {
  paymentMethodRestaurantId: number;
  restaurantID: number;
  paymentMethodID: number;
  createdAt: Date;
  restaurant?: any;
  paymentMethod?: any;
}

export interface RestaurantPaymentMethodCreateDto {
  restaurantID: number;
  paymentMethodID: number;
}

export interface RestaurantPaymentMethodUpdateDto {
  paymentMethodRestaurantId: number;
  restaurantID: number;
  paymentMethodID: number;
}

@Injectable({
  providedIn: 'root',
})
export class RestaurantPaymentMethodService {
  private apiUrl = `http://localhost:5137/api/RestaurantPaymentMethod`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<RestaurantPaymentMethod[]> {
    return this.http.get<RestaurantPaymentMethod[]>(`${this.apiUrl}/GetAll`);
  }

  getById(id: number): Observable<RestaurantPaymentMethod> {
    return this.http.get<RestaurantPaymentMethod>(
      `${this.apiUrl}/GetById/${id}`
    );
  }

  create(
    dto: RestaurantPaymentMethodCreateDto
  ): Observable<RestaurantPaymentMethod> {
    return this.http.post<RestaurantPaymentMethod>(
      `${this.apiUrl}/Insert`,
      dto
    );
  }

  update(
    dto: RestaurantPaymentMethodUpdateDto
  ): Observable<RestaurantPaymentMethod> {
    return this.http.put<RestaurantPaymentMethod>(`${this.apiUrl}/Update`, dto);
  }

  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/Delete/${id}`);
  }
}
