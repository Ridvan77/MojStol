import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { PagedResult } from './paged-result.interface';
import { TokenService } from './token.service';

export interface RestaurantType {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class RestaurantTypeService {
  private apiUrl = `${environment.serverAddress}/api/restaurant-types`;
  http = inject(HttpClient);

  private getApiUrl(restaurantTypeId: number | null = null): string {
    if (restaurantTypeId == null) {
      return this.apiUrl;
    }
    return `${this.apiUrl}/${restaurantTypeId}`;
  }

  tokenService = inject(TokenService);
  private createAuthorizationHeaders(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.tokenService.getToken()}`
    );
  }

  getAll() {
    const apiUrlFull = this.getApiUrl();
    return this.http.get<PagedResult<RestaurantType>>(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  getById(restaurantTypeId: number) {
    const apiUrlFull = this.getApiUrl(restaurantTypeId);
    return this.http.get<RestaurantType>(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  create(restaurantTypeDto: RestaurantType) {
    const apiUrlFull = this.getApiUrl();
    return this.http.post(apiUrlFull, restaurantTypeDto, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  update(restaurantTypeId: number, restaurantTypeDto: RestaurantType) {
    const apiUrlFull = this.getApiUrl(restaurantTypeId);
    return this.http.put(apiUrlFull, restaurantTypeDto, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  delete(restaurantTypeId: number) {
    const apiUrlFull = this.getApiUrl(restaurantTypeId);
    return this.http.delete(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }
}
