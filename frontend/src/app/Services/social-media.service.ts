import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface RestaurantSocialMedia {
  restaurantSocialMediaID: number;
  restaurantID: number;
  socialMediaID: number;
  link: string;
}

export interface SocialMedia {
  socialMediaID: number;
  name: string;
}

export interface SocialMediaCreateDto {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class SocialMediasService {
  private apiUrl = 'http://localhost:5137/api/SocialMedia';

  constructor(private http: HttpClient) {}

  getAllSocialMedias(): Observable<SocialMedia[]> {
    return this.http.get<SocialMedia[]>(`${this.apiUrl}`);
  }

  getSocialMediaById(socialMediaId: number): Observable<SocialMedia> {
    return this.http.get<SocialMedia>(`${this.apiUrl}/${socialMediaId}`);
  }

  createSocialMedia(
    socialMediaDto: SocialMediaCreateDto
  ): Observable<SocialMedia> {
    return this.http.post<SocialMedia>(`${this.apiUrl}`, socialMediaDto);
  }

  deleteSocialMedia(socialMediaId: number): Observable<any> {
    if (!socialMediaId) {
      throw new Error('Social media ID is required');
    }

    const url = `${this.apiUrl}/${socialMediaId}`;
    return this.http.delete(url).pipe(
      catchError((error) => {
        console.error('Delete social media error:', error);
        if (error.status === 404) {
          throw new Error('Social media not found.');
        } else {
          throw new Error('Error deleting social media. Please try again.');
        }
      })
    );
  }
}
