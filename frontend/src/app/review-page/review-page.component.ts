import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
} from '@angular/common/http';
import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PublicNavbarComponent } from '../Core/Navbar/public-navbar/public-navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Restaurant2Service,
  Restaurant,
} from '../Services/restaurant2.service';
import { TokenService } from '../Services/token.service';
import { isPlatformBrowser } from '@angular/common';
import { FooterComponent } from '../Core/Footer/footer/footer.component';

@Component({
  selector: 'review-page',
  imports: [FormsModule, CommonModule, PublicNavbarComponent, FooterComponent],
  templateUrl: './review-page.component.html',
  styleUrl: './review-page.component.css',
})
export class ReviewPageComponent {
  restaurant: Restaurant | null = null;

  route = inject(ActivatedRoute);
  restaurantService = inject(Restaurant2Service);
  tokenService = inject(TokenService);
  router = inject(Router);

  review = {
    userID: 0,
    restaurantID: 0,
    rating: 0,
    comment: '',
  };

  errors: { [key: string]: string } = {};

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.review.restaurantID = parseInt(this.route.snapshot.params['id']);

    this.review.userID = this.tokenService.getUser().sub;

    if (this.review.userID == null || this.review.userID == undefined)
      this.router.navigateByUrl('not-authorized');

    this.fetchRestaurant();
  }

  fetchRestaurant() {
    this.restaurantService.getById(this.review.restaurantID).subscribe(
      (x) => {
        this.restaurant = x;
      },
      (error) => {
        if (this.restaurant == null || this.restaurant == undefined)
          this.router.navigateByUrl('not-found');
      }
    );
  }

  setRating(value: number) {
    this.review.rating = value;
  }

  submitReview() {
    this.errors = {};

    if (this.checkFields() == 0) {
      const apiUrl = 'http://localhost:5137/api/Reviews';
      this.http.post(apiUrl, this.review).subscribe({
        next: (response) => {
          alert('Review submitted successfully!');
          this.review.rating = 0;
          this.review.comment = '';
          this.errors = {};
          console.log('!!!!!!!!--------!!!!!!!!!!');
          console.log(response);
        },
        error: (error) => {
          alert(
            'Failed to submit review. Please try again.' +
              '\n' +
              error.error.message
          );
          console.log('---------!!!!!!!--------');
          console.log(error.error.message);
        },
      });
    }
  }

  checkFields() {
    if (this.review.rating == 0) {
      this.errors['rating'] = 'Please enter rating!';
      return 1;
    }
    if (this.review.comment == '') {
      this.errors['comment'] = 'Please enter comment!';
      return 1;
    }
    this.errors = {};
    return 0;
  }
}
