import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface RestaurantPaymentMethod {
  paymentMethodRestaurantId: number;
  restaurantID: number;
  paymentMethodID: number;
  createdAt: string;
}

export interface PaymentMethod {
  paymentMethodID: number;
  name: string;
  restaurantPaymentMethod: RestaurantPaymentMethod[]; 
}


export interface PaymentMethodCreateDto {
  name: string;
}

export interface PaymentMethodUpdateDto {
  name: string;
}



@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  private apiUrl = `http://localhost:5137/api/PaymentMethod`; 

  constructor(private http: HttpClient) { }

  // 1. Get all payment methods
  getAll(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(this.apiUrl);
  }

  // 2. Get a payment method by ID
  getById(id: number): Observable<PaymentMethod> {
    return this.http.get<PaymentMethod>(`${this.apiUrl}/${id}`);
  }

  // 3. Create a new payment method
  create(paymentMethod: PaymentMethodCreateDto): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(this.apiUrl, paymentMethod);
  }

  // 4. Update a payment method
  update(id: number, paymentMethod: PaymentMethodUpdateDto): Observable<PaymentMethod> {
    return this.http.put<PaymentMethod>(`${this.apiUrl}/${id}`, paymentMethod);
  }

  // 5. Delete a payment method
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkPaymentMethodUsage(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/checkPaymentMethodUsage/${id}`);
  }
}