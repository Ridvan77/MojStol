import { Component, OnInit } from '@angular/core';
import { ReservationService, Reservation } from '../../Services/reservation.service';
import { Restaurant2Service, Restaurant } from '../../Services/restaurant2.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reservations.component.html',
  styleUrl: './admin-reservations.component.css'
})
export class AdminReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  allRestaurants: Restaurant[] = [];
  
  filters = {
    id: null as number | null,
    nameSurname: '',
    dateFrom: '',
    dateTo: '',
    restaurantId: null as number | null
  };

  constructor(
    private reservationService: ReservationService,
    private restaurantService: Restaurant2Service
  ) {}

  ngOnInit() {
    this.loadAllRestaurants();
    this.loadAllReservations();
  }

  loadAllRestaurants() {
    this.restaurantService.getAll().subscribe({
      next: (response: any) => {
        this.allRestaurants = response.resultList;
        console.log('Loaded all restaurants:', this.allRestaurants);
      },
      error: (error) => {
        console.error('Error loading restaurants', error);
      }
    });
  }

  loadAllReservations() {
    const requestParams = {
      id: this.filters.id,
      restaurantId: this.filters.restaurantId,
      nameSurname: this.filters.nameSurname || null,
      ownerId: null, // null jer želimo sve rezervacije
      dateFrom: this.formatDate(this.filters.dateFrom),
      dateTo: this.formatDate(this.filters.dateTo)
    };

    console.log('Sending request with params:', requestParams);

    this.reservationService.getAllByFilter(
      requestParams.id,
      requestParams.restaurantId,
      requestParams.nameSurname,
      requestParams.ownerId,
      requestParams.dateFrom,
      requestParams.dateTo
    ).subscribe({
      next: (data) => {
        this.reservations = data;
        console.log('Received reservations:', data);
      },
      error: (error) => {
        console.error('Error fetching reservations:', error);
      }
    });
  }

  formatDate(date: string): string | null {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0];
  }

  applyFilters() {
    this.loadAllReservations();
  }

  resetFilters() {
    this.filters = {
      id: null,
      nameSurname: '',
      dateFrom: '',
      dateTo: '',
      restaurantId: null
    };
    this.loadAllReservations();
  }

  getStatusText(statusId: number): string {
    switch (statusId) {
      case 1: return 'Pending';
      case 2: return 'Confirmed';
      case 3: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  getStatusClass(statusId: number): string {
    switch (statusId) {
      case 1: return 'badge bg-warning';
      case 2: return 'badge bg-success';
      case 3: return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }
}
