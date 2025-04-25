import { Component, OnInit, inject, Inject, PLATFORM_ID } from '@angular/core';
import {
  ReservationService,
  Reservation,
} from '../Services/reservation.service';
import { TokenService } from '../Services/token.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'reservation-edit-page',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reservation-edit-page.component.html',
  styleUrl: './reservation-edit-page.component.css',
})
export class ReservationEditPageComponent implements OnInit {
  reservationId: number = 0;
  reservation: Reservation | null = null;
  route = inject(ActivatedRoute);
  userRole: string = '';

  constructor(
    private reservationService: ReservationService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reservationId = parseInt(this.route.snapshot.params['id']);
    this.loadReservation();
    this.getUserRole();
  }

  loadReservation() {
    const userId = this.tokenService.getUser().sub;

    this.reservationService
      .getAllByFilter(
        this.reservationId, // reservationId
        null, // restaurantId
        null, // nameSurname
        null, // ownerId
        null, // dateFrom
        null // dateTo
      )
      .subscribe({
        next: (data) => {
          this.reservation = data[0];
          console.log(this.reservation);
          if (this.reservation == null || this.reservation == undefined)
            this.router.navigateByUrl('not-found');
          if (this.reservation.userID != userId)
            this.router.navigateByUrl('/not-authorized');
        },
        error: (error) => {
          console.error('Error loading reservations:', error);
          if (this.reservation == null || this.reservation == undefined)
            this.router.navigateByUrl('not-found');
        },
      });
  }

  updateReservation() {
    if (!this.reservation) return;
    if (this.reservation.statusID == 2) {
      this.cancelReservation();
      this.createReservation();
      return;
    }
    if (this.reservation.statusID == 3) return;

    const reservationDto = {
      userID: null,
      restaurantID: null,
      tableID: null,
      name: this.reservation?.name,
      reservationDate: this.reservation?.reservationDate,
      reservationTime: this.checkTimeFormat(this.reservation?.reservationTime),
      email: this.reservation?.email,
      numberOfPersons: this.reservation?.numberOfPersons,
      statusID: this.reservation.statusID,
      updatedAt: null,
    };

    this.reservationService
      .update(this.reservationId, reservationDto)
      .subscribe({
        next: () => {
          alert('Reservation updated successfully');

          if (this.userRole === 'Admin')
            this.router.navigate(['/admin/reservations']);
          if (this.userRole === 'Owner')
            this.router.navigate(['/owner/reservations']);
          if (this.userRole === 'User')
            this.router.navigate(['/user/reservations']);
        },
        error: (err) => {
          console.error('Error updating reservation', err);
          alert('Failed to update reservation details');
        },
      });
    this.loadReservation();
  }

  createReservation() {
    const token = this.tokenService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.userRole = this.tokenService.getUserRole(token);
    const reservationDto = {
      userID: this.reservation!.userID,
      restaurantID: this.reservation!.restaurantID,
      tableID: 0,
      name: this.reservation!.name,
      reservationDate: this.reservation!.reservationDate,
      reservationTime: this.checkTimeFormat(this.reservation!.reservationTime)!,
      email: this.reservation!.email,
      numberOfPersons: this.reservation!.numberOfPersons,
      statusID: 1,
    };

    this.reservationService.create(reservationDto).subscribe({
      next: () => {
        alert('Reservation created successfully');

        if (this.userRole === 'Admin')
          this.router.navigate(['/admin/reservations']);
        if (this.userRole === 'Owner')
          this.router.navigate(['/owner/reservations']);
        if (this.userRole === 'User')
          this.router.navigate(['/user/reservations']);
      },
      error: (err) => {
        console.error('Error creating reservation', err);
        alert('Failed to create reservation');
      },
    });
  }

  cancelReservation() {
    if (!this.reservation) return;
    if (this.reservation.statusID == 3) {
      return;
    }
    const token = this.tokenService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.userRole = this.tokenService.getUserRole(token);

    const reservationDto = {
      userID: null,
      restaurantID: null,
      tableID: null,
      name: null,
      reservationDate: null,
      reservationTime: null,
      email: null,
      numberOfPersons: null,
      statusID: 3,
      updatedAt: null,
    };

    this.reservationService
      .update(this.reservationId, reservationDto)
      .subscribe({
        next: () => {
          alert('Reservation cancelled successfully');

          if (this.userRole === 'Admin')
            this.router.navigate(['/admin/reservations']);
          if (this.userRole === 'Owner')
            this.router.navigate(['/owner/reservations']);
          if (this.userRole === 'User')
            this.router.navigate(['/user/reservations']);
        },
        error: (err) => {
          console.error('Error cancelling reservation', err);
          alert('Failed to cancel reservation');
        },
      });
    this.loadReservation();
  }

  cancel() {
    const token = this.tokenService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const currentUserRole = this.tokenService.getUserRole(token);
    if (currentUserRole === 'Admin')
      this.router.navigate(['/admin/reservations']);
    if (currentUserRole === 'Owner')
      this.router.navigate(['/owner/reservations']);
    if (currentUserRole === 'User')
      this.router.navigate(['/user/reservations']);
  }

  getUserRole() {
    const token = this.tokenService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.userRole = this.tokenService.getUserRole(token);
  }

  checkTimeFormat(reservationTime: string | undefined | null): string | null {
    if (reservationTime == undefined || reservationTime == null) return null;
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(reservationTime))
      return (reservationTime += ':00');
    else return reservationTime;
  }
}
