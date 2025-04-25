import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { PagedResult } from './paged-result.interface';
import { TokenService } from './token.service';

export interface City {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private apiUrl = `${environment.serverAddress}/api/cities`;
  http = inject(HttpClient);

  private getApiUrl(cityId: number | null = null): string {
    if (cityId == null) {
      return this.apiUrl;
    }
    return `${this.apiUrl}/${cityId}`;
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
    return this.http.get<PagedResult<City>>(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  getById(cityId: number) {
    const apiUrlFull = this.getApiUrl(cityId);
    return this.http.get<City>(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  create(cityDto: City) {
    const apiUrlFull = this.getApiUrl();
    return this.http.post(apiUrlFull, cityDto, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  update(cityId: number, cityDto: City) {
    const apiUrlFull = this.getApiUrl(cityId);
    return this.http.put(apiUrlFull, cityDto, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  delete(cityId: number) {
    const apiUrlFull = this.getApiUrl(cityId);
    return this.http.delete(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }
}
