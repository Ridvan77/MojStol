import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
    reviewID: number;
    userID: number;
    user: any;
    restaurantID: number;
    rating: number;
    comment: string;
    createdAt: string;
    likeCount: 0;
    dislikeCount: 0;
}

@Injectable({
    providedIn: 'root'
  })
  export class ReviewService {
    private apiUrl = 'http://localhost:5137/api/Reviews';
  
    constructor(private http: HttpClient) {}
  
    getReviewsByRestaurant(restaurantId: number): Observable<Review[]> {
      return this.http.get<Review[]>(`${this.apiUrl}/restaurantId?restaurantId=${restaurantId}`);
    }
}