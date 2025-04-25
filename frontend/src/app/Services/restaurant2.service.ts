import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { PagedResult } from './paged-result.interface';
import { RestaurantType } from './restaurant-type.service';
import { TokenService } from './token.service';
import { City } from './city.service';

export interface RestaurantUpdateDto {
  name: string; // Name is required, string type, max length 100
  description: string; // Description is required, string type, max length 500
  webSite?: string; // WebSite is optional, string type with regex pattern validation
  ownerId: number; // OwnerId is required, integer type
  cityId: number; // CityId is required, integer type
  restaurantTypeId: number; // RestaurantTypeId is required, integer type
  street: string; // Street is required, string type, max length 200
  contactNumber: string; // ContactNumber is required, string type, valid phone number format
  contactEmail: string; // ContactEmail is required, string type, valid email format
}

export interface Restaurant {
  id: string;
  logoUrl: string;
  name: string;
  description: string;
  contactNumber: string;
  contactEmail: string;
  street: string;
  ownerId: number;
  cityId: number;
  restaurantTypeId: number;
  city: City | null;
  restaurantType: RestaurantType | null;
  webSite: string | null;
  averageRating: number;
  latitude: number;
  longitude: number;
}

export interface LogoImage {
  base64Image: string;
}

export interface RestaurantLocation {
  latitude: number;
  longitude: number;
}

export interface RestaurantResponse<T> {
  count: number;
  resultList: T[];
}

@Injectable({
  providedIn: 'root',
})
export class Restaurant2Service {
  private apiUrl = `${environment.serverAddress}/api/restaurants`;
  http = inject(HttpClient);

  private getApiUrl(restaurantId: number | null = null): string {
    if (restaurantId == null) {
      return this.apiUrl;
    }
    return `${this.apiUrl}/${restaurantId}`;
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
    return this.http.get<PagedResult<Restaurant>>(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }
  getAllByCityAndType(cityId: number, restaurantTypeId: number) {
    const apiUrlFull = `${this.getApiUrl()}?CityId=${cityId}&RestaurantTypeId=${restaurantTypeId}`;
    return this.http.get<PagedResult<Restaurant>>(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  getAllWithParams(params: { [key: string]: any }) {
    let apiUrlFull = `${this.getApiUrl()}`;
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (Array.isArray(params[key])) {
        params[key].forEach((value: any) => {
          queryParams.append(key, value);
        });
      } else {
        queryParams.set(key, params[key]);
      }
    });

    apiUrlFull += '?' + queryParams.toString();
    console.log(apiUrlFull);
    return this.http.get<PagedResult<Restaurant>>(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  getAllByUserId(params: { [key: string]: any }) {
    let apiUrlFull = `${this.getApiUrl()}`;
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (Array.isArray(params[key])) {
        params[key].forEach((value: any) => {
          queryParams.append(key, value);
        });
      } else {
        queryParams.set(key, params[key]);
      }
    });

    apiUrlFull += '?' + queryParams.toString();
    console.log(apiUrlFull);
    return this.http.get<RestaurantResponse<Restaurant>>(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  getAllByRestaurantTypeId(restaurantTypeId: number) {
    const apiUrlFull = `${this.getApiUrl()}?RestaurantTypeId=${restaurantTypeId}`;
    console.log(apiUrlFull);
    return this.http.get<PagedResult<Restaurant>>(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  getAllByAverageRating() {
    const apiUrlFull = `${this.getApiUrl()}?SortBy=AverageRating&IsDecsending=true`;
    console.log(apiUrlFull);
    return this.http.get<PagedResult<Restaurant>>(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  getVisitAgainsByUserId(userID: number) {
    const apiUrlFull = `${environment.serverAddress}/api/VisitAgain/api/VisitAgain/GetVisitAgainsByUserID?userID=${userID}`;
    return this.http.get<Restaurant[]>(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  getVisitAgainsDescending() {
    const apiUrlFull = `${environment.serverAddress}/api/VisitAgain/api/VisitAgain/GetVisitAgainsDescending`;
    return this.http.get<Restaurant[]>(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  getById(restaurantId: number) {
    const apiUrlFull = this.getApiUrl(restaurantId);
    return this.http.get<Restaurant>(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  create(restaurantDto: Restaurant) {
    const apiUrlFull = this.getApiUrl();
    return this.http.post(apiUrlFull, restaurantDto, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  update(restaurantId: number, restaurantDto: RestaurantUpdateDto) {
    const apiUrlFull = this.getApiUrl(restaurantId);
    return this.http.put(apiUrlFull, restaurantDto, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  updateLogo(restaurantId: number, restaurantLogoDto: LogoImage) {
    const apiUrlFull = `${this.getApiUrl(restaurantId)}/logo`;
    return this.http.put(apiUrlFull, restaurantLogoDto, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  updateLocation(
    restaurantId: number,
    restaurantLocationDto: RestaurantLocation
  ) {
    const apiUrlFull = `${this.getApiUrl(restaurantId)}/location`;
    return this.http.put(apiUrlFull, restaurantLocationDto, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  deleteLocation(restaurantId: number) {
    const apiUrlFull = `${this.getApiUrl(restaurantId)}/location`;
    return this.http.delete(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  delete(restaurantId: number) {
    const apiUrlFull = this.getApiUrl(restaurantId);
    return this.http.delete(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }

  deleteLogo(restaurantId: number) {
    const apiUrlFull = `${this.getApiUrl(restaurantId)}/logo`;
    return this.http.delete(apiUrlFull, {
      headers: this.createAuthorizationHeaders(),
    });
  }
}
