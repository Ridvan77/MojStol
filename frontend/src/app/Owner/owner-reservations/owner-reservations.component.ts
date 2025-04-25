import { Component, OnInit } from '@angular/core';
import {
  ReservationService,
  Reservation,
} from '../../Services/reservation.service';
import { TokenService } from '../../Services/token.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Restaurant2Service,
  Restaurant,
} from '../../Services/restaurant2.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owner-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './owner-reservations.component.html',
  styleUrl: './owner-reservations.component.css',
})
export class OwnerReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  userRestaurants: Restaurant[] = [];
  filters = {
    nameSurname: '',
    dateFrom: '',
    dateTo: '',
    id: null,
    restaurantId: null as number | null,
  };

  constructor(
    private reservationService: ReservationService,
    private tokenService: TokenService,
    private restaurantService: Restaurant2Service
  ) {}

  ngOnInit() {
    this.loadOwnerRestaurants();
    this.loadOwnerReservations();
  }

  formatDate(date: string): string | null {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0];
  }

  loadOwnerRestaurants() {
    const userId = this.tokenService.getUser().sub;
    this.restaurantService.getAllByUserId({ OwnerId: userId }).subscribe({
      next: (response: any) => {
        this.userRestaurants = response.resultList;
        console.log('Loaded restaurants:', this.userRestaurants);
      },
      error: (error) => {
        console.error('Error loading restaurants', error);
      },
    });
  }

  loadOwnerReservations() {
    const user = this.tokenService.getUser();
    if (user && user.sub) {
      const requestParams = {
        id: this.filters.id,
        restaurantId: this.filters.restaurantId,
        nameSurname: this.filters.nameSurname || null,
        ownerId: user.sub,
        dateFrom: this.formatDate(this.filters.dateFrom),
        dateTo: this.formatDate(this.filters.dateTo),
      };

      console.log('Sending request with params:', requestParams);

      this.reservationService
        .getAllByFilter(
          requestParams.id,
          requestParams.restaurantId,
          requestParams.nameSurname,
          requestParams.ownerId,
          requestParams.dateFrom,
          requestParams.dateTo
        )
        .subscribe({
          next: (data) => {
            this.reservations = data;
            console.log('Received reservations:', data);
          },
          error: (error) => {
            console.error('Greška pri dohvaćanju rezervacija:', error);
          },
        });
    }
  }

  applyFilters() {
    this.loadOwnerReservations();
  }

  resetFilters() {
    this.filters = {
      id: null,
      nameSurname: '',
      dateFrom: '',
      dateTo: '',
      restaurantId: null,
    };
    this.loadOwnerReservations();
  }

  getStatusText(statusId: number): string {
    switch (statusId) {
      case 1:
        return 'Na čekanju';
      case 2:
        return 'Potvrđeno';
      case 3:
        return 'Otkazano';
      default:
        return 'Nepoznato';
    }
  }

  getStatusClass(statusId: number): string {
    switch (statusId) {
      case 1:
        return 'badge bg-warning';
      case 2:
        return 'badge bg-success';
      case 3:
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  deleteReservation(reservationId: number) {
    if (confirm('Are you sure you want to delete this reservation?')) {
      this.reservationService.delete(reservationId).subscribe({
        next: () => {
          this.loadOwnerReservations();
        },
        error: (error) => {
          console.error('Error deleting reservation:', error);
        },
      });
    }
  }
}
