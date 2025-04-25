import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { PagedResult } from './paged-result.interface';
import { TokenService } from './token.service';

export interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  menuCategoryId: number;
}

@Injectable({
  providedIn: 'root',
})
export class MenuItemService {
  private apiUrl = `${environment.serverAddress}/api/restaurants`;
  http = inject(HttpClient);

  private getApiUrl(
    restaurantId: number,
    menuItemId: number | null = null
  ): string {
    if (menuItemId == null) {
      return `${this.apiUrl}/${restaurantId}/menu-items`;
    }
    return `${this.apiUrl}/${restaurantId}/menu-items/${menuItemId}`;
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
    return this.http.get<PagedResult<MenuItem>>(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  create(restaurantId: number, menuItemDto: MenuItem) {
    const apiUrlFull = this.getApiUrl(restaurantId);
    return this.http.post(apiUrlFull, menuItemDto, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  update(restaurantId: number, menuItemId: number, menuItemDto: MenuItem) {
    const apiUrlFull = this.getApiUrl(restaurantId, menuItemId);
    return this.http.put(apiUrlFull, menuItemDto, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  delete(restaurantId: number, menuItemId: number) {
    const apiUrlFull = this.getApiUrl(restaurantId, menuItemId);
    return this.http.delete(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }
}
