import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

export interface Reservation {
  reservationID: number;
  userID: number;
  user: any;
  restaurantID: number;
  restaurant: any;
  tableID: number;
  table: any;
  name: string;
  reservationDate: string;
  reservationTime: string;
  email: string;
  numberOfPersons: number;
  statusID: number;
  status: any;
  createdAt: string;
  updatedAt: string;
  isScanned: boolean;
}

export interface ReservationUpdateDto {
  userID: number | null;
  restaurantID: number | null;
  tableID: number | null;
  name: string | null;
  reservationDate: string | null;
  reservationTime: string | null;
  email: string | null;
  numberOfPersons: number | null;
  statusID: number | null;
  updatedAt: string | null;
}

export interface ReservationCreateDto {
  userID: number;
  restaurantID: number;
  tableID: number;
  name: string;
  reservationDate: string;
  reservationTime: string;
  email: string;
  numberOfPersons: number;
  statusID: number;
}

export interface ScanRequest {
  reservationID: number;
  ownerID: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  http = inject(HttpClient);

  getAll() {
    const apiUrl = `http://localhost:5137/api/Reservations`;
    return this.http.get<Reservation[]>(apiUrl);
  }

  getAllByFilter(
    id: number | null,
    restaurantId: number | null,
    nameSurname: string | null,
    ownerId: number | null,
    dateFrom: string | null,
    dateTo: string | null,
    userId: number | null = null
  ) {
    var apiUrl = `${environment.serverAddress}/GetReservationByFilters?`;
    if (id != null) apiUrl += `id=${id}&`;
    if (restaurantId != null) apiUrl += `restaurantId=${restaurantId}&`;
    if (nameSurname != null) apiUrl += `nameSurname=${nameSurname}&`;
    if (ownerId != null) apiUrl += `ownerId=${ownerId}&`;
    if (dateFrom != null) apiUrl += `dateFrom=${dateFrom}&`;
    if (dateTo != null) apiUrl += `dateTo=${dateTo}&`;
    if (userId != null) apiUrl += `userId=${userId}&`;

    return this.http.get<Reservation[]>(apiUrl);
  }

  update(reservationId: number, reservationDto: ReservationUpdateDto) {
    const apiUrl = `http://localhost:5137/api/Reservations/${reservationId}`;
    return this.http.put(apiUrl, reservationDto);
  }

  create(reservationDto: ReservationCreateDto) {
    const apiUrl = `http://localhost:5137/api/Reservations`;
    return this.http.post(apiUrl, reservationDto);
  }

  delete(reservationId: number) {
    const apiUrl = `http://localhost:5137/api/Reservations/${reservationId}`;
    return this.http.delete(apiUrl);
  }

  ScanQrCode(scanRequest: ScanRequest) {
    const apiUrl = `http://localhost:5137/api/Reservations/scanQrCode`;
    return this.http.put(apiUrl, scanRequest);
  }
}
