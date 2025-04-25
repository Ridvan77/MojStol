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
import { Favourite, FavouritesService } from '../Services/favourites.service';
import { TokenService } from '../Services/token.service';

@Component({
  selector: 'my-favourites',
  imports: [
    PublicNavbarComponent,
    FooterComponent,
    RouterLink,
    CommonModule,
    StarsRatingComponent,
  ],
  templateUrl: './my-favourites.component.html',
  styleUrl: './my-favourites.component.css',
})
export class MyFavouritesComponent implements OnInit {
  restaurantList: Restaurant[] = [];
  restaurantService = inject(Restaurant2Service);
  route = inject(ActivatedRoute);
  favouriteService = inject(FavouritesService);
  tokenService = inject(TokenService);
  userId = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.userId = this.tokenService.getUser().sub;
    this.fetchRestaurants();
  }

  fetchRestaurants() {
    this.favouriteService.getFavouritesByUserID(this.userId).subscribe({
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

  getFavouriteByUserAndRestaurant(id: string) {
    var favouriteId: number = 0;
    this.favouriteService
      .getFavouriteByUserAndRestaurant(this.userId, parseInt(id))
      .subscribe({
        next: (x) => {
          favouriteId = x.favouritesID;
          this.deleteFavourite(favouriteId);
          console.log('favouriteId ', favouriteId);
        },
        error: (err) => {
          console.log('error ', err);
        },
      });
  }

  deleteFavourite(id: number) {
    this.favouriteService.deleteFavourite(id).subscribe({
      next: () => {
        this.fetchRestaurants();
        alert('Favourite removed successfully');
      },
      error: (error) => {
        console.error('Error removing favourite', error);
        alert('Error removing favourite');
      },
    });
    this.fetchRestaurants();
  }

  redirect(id: string) {
    this.router.navigate([`/restaurants/${id}`]);
  }
}
