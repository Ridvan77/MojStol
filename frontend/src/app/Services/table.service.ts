import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { PagedResult } from './paged-result.interface';
import { TokenService } from './token.service';

export interface Table {
  id: number;
  tableNumber: number;
  seats: number;
  isFunctional: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private apiUrl = `${environment.serverAddress}/api/restaurants`;
  http = inject(HttpClient);

  private getApiUrl(
    restaurantId: number,
    tableId: number | null = null
  ): string {
    if (tableId == null) {
      return `${this.apiUrl}/${restaurantId}/tables`;
    }
    return `${this.apiUrl}/${restaurantId}/tables/${tableId}`;
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
    return this.http.get<PagedResult<Table>>(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  createMultiple(restaurantId: number, tablesDto: Table[]) {
    const apiUrlFull = this.getApiUrl(restaurantId);
    return this.http.post(apiUrlFull, tablesDto, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  update(restaurantId: number, tableId: number, tableDto: Table) {
    const apiUrlFull = this.getApiUrl(restaurantId, tableId);
    return this.http.put(apiUrlFull, tableDto, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  delete(restaurantId: number, tableId: number) {
    const apiUrlFull = this.getApiUrl(restaurantId, tableId);
    return this.http.delete(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }
}
