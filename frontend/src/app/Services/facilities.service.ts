import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface RestaurantFacility {
  restaurantFacilitiesID: number;
  restaurantID: number;
  facilitiesID: number;
  dateAdded: string;
  isActive: boolean;
}

export interface Facility {
  facilitiesID: number;
  name: string;
}

export interface FacilityCreateDto {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class FacilitiesService {
  private apiUrl = 'http://localhost:5137/api/Facilities';

  constructor(private http: HttpClient) {}

  getAllFacilities(): Observable<Facility[]> {
    return this.http.get<Facility[]>(`${this.apiUrl}`);
  }

  getFacilityById(facilityId: number): Observable<Facility> {
    return this.http.get<Facility>(`${this.apiUrl}/${facilityId}`);
  }

  createFacility(facilityDto: FacilityCreateDto): Observable<Facility> {
    return this.http.post<Facility>(`${this.apiUrl}`, facilityDto);
  }

  deleteFacility(facilityId: number): Observable<any> {
    if (!facilityId) {
      throw new Error('Facility ID is required');
    }

    const url = `${this.apiUrl}/${facilityId}`;
    return this.http.delete(url).pipe(
      catchError((error) => {
        console.error('Delete facility error:', error);
        if (error.status === 404) {
          throw new Error('Facility not found.');
        } else {
          throw new Error('Error deleting facility. Please try again.');
        }
      })
    );
  }
}
