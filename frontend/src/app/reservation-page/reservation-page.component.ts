import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PublicNavbarComponent } from '../Core/Navbar/public-navbar/public-navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Restaurant2Service,
  Restaurant,
} from '../Services/restaurant2.service';
import { TokenService } from '../Services/token.service';
import { isPlatformBrowser } from '@angular/common';
import { FooterComponent } from '../Core/Footer/footer/footer.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'reservation-page',
  imports: [FormsModule, PublicNavbarComponent, FooterComponent, NgIf],
  templateUrl: './reservation-page.component.html',
  styleUrl: './reservation-page.component.css',
})
export class ReservationPageComponent {
  restaurant: Restaurant | null = null;

  route = inject(ActivatedRoute);
  tokenService = inject(TokenService);
  restaurantService = inject(Restaurant2Service);
  router = inject(Router);

  reservation = {
    userID: 0,
    restaurantID: 0,
    tableID: 5,
    name: '',
    reservationDate: '',
    reservationTime: '',
    numberOfPersons: 1,
    email: '',
    phone: '',
    statusID: 1,
  };

  errors: { [key: string]: string } = {};

  ngOnInit(): void {
    this.reservation.restaurantID = parseInt(this.route.snapshot.params['id']);

    this.reservation.userID = this.tokenService.getUser().sub;

    if (this.reservation.userID == null || this.reservation.userID == undefined)
      this.router.navigateByUrl('not-authorized');

    this.fetchRestaurant();
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {}

  submitReservation() {
    this.errors = {};
    console.log(this.errors);

    if (this.checkFields() == 0) {
      console.log(this.errors);
      const apiUrl = 'http://localhost:5137/api/Reservations';

      this.reservation.reservationTime += ':00';
      console.log(this.reservation);
      this.http.post(apiUrl, this.reservation).subscribe({
        next: (response) => {
          alert('Reservation submitted successfully!');
          this.reservation = {
            userID: this.reservation.userID,
            restaurantID: this.reservation.restaurantID,
            tableID: 5,
            name: '',
            reservationDate: '',
            reservationTime: '',
            numberOfPersons: 1,
            email: '',
            phone: '',
            statusID: 1,
          };
          this.errors = {};
          console.log('!!!!!!!!--------!!!!!!!!!!');
          console.log(response);
        },
        error: (error) => {
          console.log('---------!!!!!!!--------');
          console.log(error.error.message);

          if (
            error.error.message ==
            "You can't make a reservation on the same date as your previous one!"
          )
            this.errors['date'] = error.error.message;
          else if (
            error.error.message ==
            "You can't make a reservation for today or earlier!"
          )
            this.errors['date'] = error.error.message;
          else if (
            error.error.message ==
            "You can't make a reservation because a restaurant is closed that day!"
          )
            this.errors['date'] = error.error.message;
          else if (
            error.error.message ==
            "You can't make a reservation in that particular time!"
          )
            this.errors['time'] = error.error.message;
        },
      });
    }
  }

  checkFields(): number {
    if (this.reservation.name.length < 3 || this.reservation.name.length > 30) {
      this.errors['name'] = 'Name should be between 3 and 30 characters long!';
      return 1;
    }
    if (this.reservation.reservationDate == '') {
      this.errors['date'] = 'Please select date!';
      return 1;
    }
    if (this.reservation.reservationTime == '') {
      this.errors['time'] = 'Please select time!';
      return 1;
    }
    if (
      this.reservation.numberOfPersons < 1 ||
      this.reservation.numberOfPersons > 8
    ) {
      this.errors['numberOfPersons'] =
        'Number of persons should be between 1 and 8!';
      return 1;
    }
    if (this.reservation.email.length == 0) {
      this.errors['email'] = 'Please enter email!';
      return 1;
    }
    if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        this.reservation.email
      )
    ) {
      this.errors['email'] = 'Please enter valid email!';
      return 1;
    }
    if (this.reservation.phone.length == 0) {
      this.errors['phone'] = 'Please enter phone number!';
      return 1;
    }
    if (
      !/^[\+]?[0-9]{0,3}\W?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/.test(
        this.reservation.phone
      )
    ) {
      this.errors['phone'] = 'Please enter valid phone number!';
      return 1;
    }
    this.errors = {};
    return 0;
  }

  updateGuestCount(change: number) {
    this.reservation.numberOfPersons += change;
  }

  fetchRestaurant() {
    this.restaurantService.getById(this.reservation.restaurantID).subscribe(
      (x) => {
        this.restaurant = x;
      },
      (error) => {
        if (this.restaurant == null || this.restaurant == undefined)
          this.router.navigateByUrl('not-found');
      }
    );
  }
}
