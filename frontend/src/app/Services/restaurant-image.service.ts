import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { PagedResult } from './paged-result.interface';
import { TokenService } from './token.service';

export interface RestaurantImage {
  id: number;
  imageUrl: string;
}

export interface RestaurantImageDto {
  base64Image: string;
}

@Injectable({
  providedIn: 'root',
})
export class RestaurantImageService {
  private apiUrl = `${environment.serverAddress}/api/restaurants`;
  http = inject(HttpClient);

  private getApiUrl(restaurantId: number): string {
    return `${this.apiUrl}/${restaurantId}/restaurant-images`;
  }

  tokenService = inject(TokenService);
  private createAuthorizationHeaders(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.tokenService.getToken()}`
    );
  }

  getAll(restaurantId: number) {
    const apiUrlFull = this.getApiUrl(restaurantId);
    return this.http.get<PagedResult<RestaurantImage>>(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  create(restaurantId: number, restaurantImagesDto: RestaurantImageDto[]) {
    const apiUrlFull = this.getApiUrl(restaurantId);
    return this.http.post(apiUrlFull, restaurantImagesDto, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  delete(restaurantId: number, imageIds: number[]) {
    const apiUrlFull = this.getApiUrl(restaurantId);
    return this.http.delete(apiUrlFull, {
      body: imageIds,
      headers: this.createAuthorizationHeaders(),
    });
  }
}
