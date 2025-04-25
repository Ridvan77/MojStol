import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../environments/environment.development';
import {
  MenuCategory,
  MenuCategoryService,
} from '../../Services/menu-category.service';
import { MenuItem, MenuItemService } from '../../Services/menu-item.service';
import { RestaurantPaymentMethod } from '../../Services/payment-method.service';
import {
  RestaurantFacilitiesService,
  RestaurantFacility,
} from '../../Services/restaurant-facilities.service';
import { RestaurantPaymentMethodService } from '../../Services/restaurant-payment-method.service';
import { RestaurantTagService } from '../../Services/restaurant-tag.service';
import {
  Restaurant,
  Restaurant2Service,
  RestaurantLocation,
} from '../../Services/restaurant2.service';
import {
  ReviewVotes,
  ReviewVotesCreateDto,
  ReviewVotesService,
} from '../../Services/review-votes.service';
import { Review, ReviewService } from '../../Services/review.service';
import { Table, TableService } from '../../Services/table.service';
import { RestaurantTag } from '../../Services/tag.service';
import { TokenService } from '../../Services/token.service';
import {
  WorkingHours,
  WorkingHoursService,
} from '../../Services/working-hours.service';
import { CarouselComponent } from '../carousel/carousel.component';
import { MapViewComponent } from '../maps/map-view/map-view.component';
import { PaymentMethodsViewComponent } from '../payment-methods/payment-methods-view/payment-methods-view.component';
import { StarsRatingComponent } from '../stars-rating/stars-rating.component';
import { TagsViewComponent } from '../tags/tags-view/tags-view.component';
import { WorkingHoursViewComponent } from '../working-hours/working-hours-view/working-hours-view.component';

@Component({
  selector: 'app-restaurant-details',
  imports: [
    RouterLink,
    CommonModule,
    StarsRatingComponent,
    TranslateModule,
    MapViewComponent,
    WorkingHoursViewComponent,
    CarouselComponent,
    TagsViewComponent,
    PaymentMethodsViewComponent,
  ],
  standalone: true,
  templateUrl: './restaurant-details.component.html',
  styleUrl: './restaurant-details.component.css',
})
export class RestaurantDetailsComponent implements OnInit {
  logoImageSrc: string = '';

  restaurantId: number = 0;

  restaurant: Restaurant | null = null;
  restaurantLocation: RestaurantLocation | null = null;

  menuCategories: MenuCategory[] = [];
  menuItems: MenuItem[] = [];
  reviews: Review[] = [];
  reviewVotes: ReviewVotes[][] = [];
  restaurantFacilities: RestaurantFacility[] = [];

  drinkSet: MenuCategory[] = [];
  foodSet: MenuCategory[] = [];

  workingDays: WorkingHours[] = [];

  tables: Table[] = [];
  uniqueSeats: number[] = [];
  capacity: number = 0;

  tags: RestaurantTag[] = [];

  paymentMethods: RestaurantPaymentMethod[] = [];

  token: any;

  // Services
  restaurantService = inject(Restaurant2Service);
  reviewService = inject(ReviewService);
  revieWVotesService = inject(ReviewVotesService);
  restaurantFacilitiesService = inject(RestaurantFacilitiesService);
  workingHoursService = inject(WorkingHoursService);
  menuCategoryService = inject(MenuCategoryService);
  menuItemService = inject(MenuItemService);
  tableService = inject(TableService);
  restaurantTagService = inject(RestaurantTagService);
  restaurantPaymentMethodService = inject(RestaurantPaymentMethodService);
  tokenService = inject(TokenService);

  titleService = inject(Title);
  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.params['id'];
    this.token = this.tokenService.getUser();

    this.fetchRestaurant();
    this.fetchMenuCategories();
    this.fetchMenuItems();
    this.fetchWorkingHours();
    this.fetchReviews();
    this.fetchFacilities();
    this.fetchTags();
    this.fetchPaymentMethods();
  }

  fetchFacilities() {
    this.restaurantFacilitiesService
      .getRestaurantFacilitiesByRestaurant(this.restaurantId)
      .subscribe(
        (data) => {
          this.restaurantFacilities = data;
        },
        (error) => {
          console.error('Error fetching facilities: ', error);
        }
      );
  }

  fetchReviews() {
    this.reviewService.getReviewsByRestaurant(this.restaurantId).subscribe(
      (data) => {
        this.reviews = data;
        this.fetchReviewVotes();
      },
      (error) => {
        console.error('Error fetching reviews: ', error);
      }
    );
  }

  fetchReviewVotes() {
    this.reviews.forEach((review) => {
      this.revieWVotesService
        .getReviewVotesByReview(review.reviewID)
        .subscribe((data) => {
          if (data === null || data.length === 0) return;
          this.reviewVotes.push(data);
          for (let i = 0; i < data.length; i++) {
            this.fetchLikesDislikes(data[i].reviewID, data[i].isLike);
          }
        });
    });
  }

  fetchLikesDislikes(reviewID: number, isLike: boolean): number {
    var count = 0;
    this.reviewVotes.forEach((reviewVote: ReviewVotes[]) => {
      for (let i = 0; i < reviewVote.length; i++) {
        if (
          reviewVote[i].reviewID === reviewID &&
          reviewVote[i].isLike === isLike
        )
          count++;
      }
    });
    return count;
  }

  fetchRestaurant() {
    this.restaurantService.getById(this.restaurantId).subscribe({
      next: (x) => {
        this.restaurant = x;
        if (
          this.restaurant.latitude != null &&
          this.restaurant.longitude != null
        ) {
          this.restaurantLocation = {
            latitude: x.latitude!,
            longitude: x.longitude!,
          };
        }
        if (this.restaurant.logoUrl != null) {
          this.logoImageSrc = `${environment.serverAddress}/${this.restaurant.logoUrl}`;
        } else {
          this.logoImageSrc = '/assets/images/restaurant/default-logo.png';
        }
        console.log(this.restaurant);

        this.titleService.setTitle(`Restoran - ${this.restaurant.name}`);
      },
      error: (err) => {
        this.router.navigate(['not-found']);
      },
    });
  }
  fetchMenuCategories() {
    this.menuCategoryService.getAll(this.restaurantId).subscribe((x) => {
      const enum MenuCategoryType {
        Food,
        Drink,
      }
      this.menuCategories = x.resultList;
      this.foodSet = this.menuCategories.filter(
        (mc) => mc.categoryType == MenuCategoryType.Food
      );
      this.drinkSet = this.menuCategories.filter(
        (mc) => mc.categoryType == MenuCategoryType.Drink
      );
    });
  }
  fetchMenuItems() {
    this.menuItemService.getAll(this.restaurantId).subscribe((x) => {
      this.menuItems = x.resultList;
    });
  }

  filteredMenuItems(menuCategoryId: number) {
    return this.menuItems.filter((mi) => mi.menuCategoryId == menuCategoryId);
  }

  fetchWorkingHours() {
    this.workingHoursService.getAll(this.restaurantId).subscribe((x) => {
      this.workingDays = x.resultList;
      this.workingDays.forEach((day) => {
        day.openTime = day.openTime.slice(0, 5); // Ensure HH:mm format
        day.closeTime = day.closeTime.slice(0, 5); // Ensure HH:mm format
      });
      console.log('workingDays:', this.workingDays);
    });
  }

  fetchTables() {
    this.tableService.getAll(this.restaurantId).subscribe((x) => {
      this.tables = x.resultList;
      console.log(this.tables);

      this.uniqueSeats = [...new Set(this.tables.map((table) => table.seats))];
      console.log(this.uniqueSeats);

      const seatsCount: { [key: number]: number } = {};
      this.uniqueSeats.forEach((seats) => {
        seatsCount[seats] = this.tables.filter(
          (table) => table.seats === seats
        ).length;
      });
      console.log(seatsCount);

      this.capacity = this.tables
        .map((t) => t.seats)
        .reduce((acc, seats) => acc + seats);
      console.log(this.capacity);
    });
  }

  fetchTags() {
    this.restaurantTagService.getAll().subscribe((x) => {
      this.tags = x
        .filter((rt) => rt.restaurantId == this.restaurantId)
        .map((rt) => {
          return {
            restaurantTagId: rt.restaurantTagId,
            restaurantId: rt.restaurantId,
            tagId: rt.tagID,
            createdAt: rt.createdAt.toString(),
          };
        });
      console.log('tagovi: ', this.tags);
    });
  }

  fetchPaymentMethods() {
    this.restaurantPaymentMethodService.getAll().subscribe((x) => {
      this.paymentMethods = x
        .filter((rpm) => rpm.restaurantID == this.restaurantId)
        .map((rpm) => {
          return {
            paymentMethodRestaurantId: rpm.paymentMethodRestaurantId,
            restaurantID: rpm.restaurantID,
            paymentMethodID: rpm.paymentMethodID,
            createdAt: rpm.createdAt.toString(),
          };
        });
      console.log('payment metode: ', this.paymentMethods);
    });
  }

  closeAndFetchMenuCategories() {
    this.fetchMenuCategories();
  }

  closeAndFetchMenuItems() {
    this.fetchMenuItems();
  }

  closeAndFetchWorkingHours() {
    this.fetchWorkingHours();
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

  likeReview(reviewId: number, isLike: boolean) {
    const reviewVote: ReviewVotesCreateDto = {
      userID: +this.token.sub,
      reviewID: reviewId,
      isLike: isLike,
    };
    this.revieWVotesService.postReviewVote(reviewVote);
    this.fetchLikesDislikes(reviewId, isLike); // ne fetch-a like/dislike-ove vec se treba koristiti fetchReviewVotes
  }

  addHttpProtocol(url: string | null | undefined): string {
    if (!url) return '';

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'http://' + url;
    }

    return url;
  }
}
