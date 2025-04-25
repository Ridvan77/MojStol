import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { PagedResult } from './paged-result.interface';
import { TokenService } from './token.service';

export interface WorkingHours {
  id: number;
  day: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class WorkingHoursService {
  private apiUrl = `${environment.serverAddress}/api/restaurants`;
  http = inject(HttpClient);

  private getApiUrl(restaurantId: number): string {
    return `${this.apiUrl}/${restaurantId}/working-hours`;
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
    return this.http.get<PagedResult<WorkingHours>>(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  create(restaurantId: number, workingHoursDto: WorkingHours[]) {
    const apiUrlFull = this.getApiUrl(restaurantId);
    return this.http.post(apiUrlFull, workingHoursDto, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  update(restaurantId: number, workingHoursDto: WorkingHours[]) {
    const apiUrlFull = this.getApiUrl(restaurantId);
    return this.http.put(apiUrlFull, workingHoursDto, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  delete(restaurantId: number) {
    const apiUrlFull = this.getApiUrl(restaurantId);
    return this.http.delete(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }
}
