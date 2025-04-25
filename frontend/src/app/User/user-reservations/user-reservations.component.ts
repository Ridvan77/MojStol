import { Component, OnInit } from '@angular/core';
import { ReservationService, Reservation } from '../../Services/reservation.service';
import { TokenService } from '../../Services/token.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-reservations',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-reservations.component.html',
  styleUrls: ['./user-reservations.component.css']
})
export class UserReservationsComponent implements OnInit {

  reservations: Reservation[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private reservationService: ReservationService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserReservations();
  }

  loadUserReservations() {
    this.loading = true;
    const userId = this.tokenService.getUser().sub;

    this.reservationService.getAllByFilter(
      null,           // reservationId
      null,           // restaurantId
      null,           // nameSurname
      null,           // ownerId
      null,           // dateFrom
      null,           // dateTo
      userId          // userId
    ).subscribe({
      next: (data) => {
        this.reservations = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading reservations';
        this.loading = false;
        console.error('Error loading reservations:', error);
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US');
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  deleteReservation(reservationId: number) {
    if (confirm('Are you sure you want to delete this reservation?')) {
      this.loading = true;
      this.reservationService.delete(reservationId).subscribe({
        next: () => {
          this.loading = false;
          this.loadUserReservations();
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Error deleting reservation';
          console.error('Error deleting reservation:', error);
        }
      });
    }
  }
}
