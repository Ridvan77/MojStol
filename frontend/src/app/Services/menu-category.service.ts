import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { PagedResult } from './paged-result.interface';
import { TokenService } from './token.service';

export interface MenuCategory {
  id: number;
  name: string;
  categoryType: number;
}

@Injectable({
  providedIn: 'root',
})
export class MenuCategoryService {
  private apiUrl = `${environment.serverAddress}/api/restaurants`;
  http = inject(HttpClient);

  private getApiUrl(
    restaurantId: number,
    menuCategoryId: number | null = null
  ): string {
    if (menuCategoryId == null) {
      return `${this.apiUrl}/${restaurantId}/menu-categories`;
    }
    return `${this.apiUrl}/${restaurantId}/menu-categories/${menuCategoryId}`;
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
    return this.http.get<PagedResult<MenuCategory>>(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  create(restaurantId: number, menuCategoryDto: MenuCategory) {
    const apiUrlFull = this.getApiUrl(restaurantId);
    return this.http.post(apiUrlFull, menuCategoryDto, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  update(
    restaurantId: number,
    menuCategoryId: number,
    menuCategoryDto: MenuCategory
  ) {
    const apiUrlFull = this.getApiUrl(restaurantId, menuCategoryId);
    return this.http.put(apiUrlFull, menuCategoryDto, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  delete(restaurantId: number, menuCategoryId: number) {
    const apiUrlFull = this.getApiUrl(restaurantId, menuCategoryId);
    return this.http.delete(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }
}
