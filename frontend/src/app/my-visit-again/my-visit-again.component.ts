import { Component, inject, OnInit } from '@angular/core';
import { PublicNavbarComponent } from '../Core/Navbar/public-navbar/public-navbar.component';
import { FooterComponent } from '../Core/Footer/footer/footer.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  Restaurant,
  Restaurant2Service,
} from '../Services/restaurant2.service';
import { CommonModule } from '@angular/common';
import { StarsRatingComponent } from '../components/stars-rating/stars-rating.component';
import { TokenService } from '../Services/token.service';

@Component({
  selector: 'my-visit-agains',
  imports: [
    PublicNavbarComponent,
    FooterComponent,
    RouterLink,
    CommonModule,
    StarsRatingComponent,
  ],
  templateUrl: './my-visit-again.component.html',
  styleUrl: './my-visit-again.component.css',
})
export class MyVisitAgainComponent implements OnInit {
  restaurantList: Restaurant[] = [];
  restaurantService = inject(Restaurant2Service);
  route = inject(ActivatedRoute);
  tokenService = inject(TokenService);
  userId = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.userId = this.tokenService.getUser().sub;
    this.fetchRestaurants();
  }

  fetchRestaurants() {
    this.restaurantService.getVisitAgainsByUserId(this.userId).subscribe({
      next: (x) => {
        this.restaurantList = x;
      },
      error: (err) => {
        console.log('error ', err);
      },
    });
  }

  getFullStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 !== 0;
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.ceil(rating)).fill(0);
  }

  redirect(id: string) {
    this.router.navigate([`/restaurants/${id}`]);
  }
}
