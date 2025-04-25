import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../environments/environment.development';
import {
  MenuCategory,
  MenuCategoryService,
} from '../../Services/menu-category.service';
import { MenuItem, MenuItemService } from '../../Services/menu-item.service';
import { RestaurantPaymentMethod } from '../../Services/payment-method.service';
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
  ReviewVotesUpdateDto,
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
import { ImagesModalComponent } from '../images-modal/images-modal.component';
import { LogoModalComponent } from '../logo-modal/logo-modal.component';
import { MapModalComponent } from '../maps/map-modal/map-modal.component';
import { MapViewComponent } from '../maps/map-view/map-view.component';
import { MenuCategoryDeleteModalComponent } from '../menu-category-modals/menu-category-delete-modal/menu-category-delete-modal.component';
import { MenuCategoryModalComponent } from '../menu-category-modals/menu-category-modal/menu-category-modal.component';
import { MenuItemDeleteModalComponent } from '../menu-item-modals/menu-item-delete-modal/menu-item-delete-modal.component';
import { MenuItemModalComponent } from '../menu-item-modals/menu-item-modal/menu-item-modal.component';
import { PaymentMethodsModalComponent } from '../payment-methods/payment-methods-modal/payment-methods-modal.component';
import { PaymentMethodsViewComponent } from '../payment-methods/payment-methods-view/payment-methods-view.component';
import { RestaurantModalComponent } from '../restaurant-modal/restaurant-modal.component';
import { StarsRatingComponent } from '../stars-rating/stars-rating.component';
import { TableModalComponent } from '../table-modals/table-modal/table-modal.component';
import { TagsModalComponent } from '../tags/tags-modal/tags-modal.component';
import { TagsViewComponent } from '../tags/tags-view/tags-view.component';
import { WorkingHoursModalComponent } from '../working-hours/working-hours-modal/working-hours-modal.component';
import { WorkingHoursViewComponent } from '../working-hours/working-hours-view/working-hours-view.component';
import { FacilitiesModalComponent } from '../facilities/facilities-modal/facilities-modal.component';
import { FacilitiesViewComponent } from '../facilities/facilities-view/facilities-view.component';
import { SocialMediasModalComponent } from '../socialMedias/social-medias-modal/social-medias-modal.component';
import { SocialMediasViewComponent } from '../socialMedias/social-medias-view/social-medias-view.component';
import {
  RestaurantFacilitiesService,
  RestaurantFacility,
} from '../../Services/restaurant-facilities.service';
import {
  RestaurantSocialMedia,
  RestaurantSocialMediaService,
} from '../../Services/restaurant-social-media.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-restaurant-details-owner',
  imports: [
    NgClass,
    CommonModule,
    StarsRatingComponent,
    MenuCategoryModalComponent,
    MenuItemModalComponent,
    MenuCategoryDeleteModalComponent,
    MenuItemDeleteModalComponent,
    WorkingHoursModalComponent,
    MapViewComponent,
    MapModalComponent,
    RestaurantModalComponent,
    LogoModalComponent,
    CarouselComponent,
    ImagesModalComponent,
    TableModalComponent,
    TranslateModule,
    WorkingHoursViewComponent,
    TagsModalComponent,
    TagsViewComponent,
    PaymentMethodsViewComponent,
    PaymentMethodsModalComponent,
    FacilitiesModalComponent,
    FacilitiesViewComponent,
    SocialMediasModalComponent,
    SocialMediasViewComponent,
    RouterModule,
  ],
  templateUrl: './restaurant-details-owner.component.html',
  styleUrl: './restaurant-details-owner.component.css',
})
export class RestaurantDetailsOwnerComponent implements OnInit {
  openRestaurantImagesModal: boolean = false;
  imagesChanged: boolean = false;

  logoImageSrc: string = '';
  selectedLogoImage: string | null = null;

  openRestaurantTagsModal: boolean = false;

  openRestaurantPaymentMethodsModal: boolean = false;

  openRestaurantFacilitiesModal: boolean = false;

  openRestaurantSocialMediaModal: boolean = false;

  restaurantId: number = 0;

  restaurant: Restaurant | null = null;
  restaurantLocation: RestaurantLocation = {
    latitude: 0,
    longitude: 0,
  };

  reviews: Review[] = [];
  reviewVotesArray: ReviewVotes[][] = [];

  menuCategories: MenuCategory[] = [];
  menuItems: MenuItem[] = [];

  drinkSet: MenuCategory[] = [];
  foodSet: MenuCategory[] = [];

  workingDays: WorkingHours[] = [];

  tables: Table[] = [];
  uniqueSeats: number[] = [];

  tags: RestaurantTag[] = [];

  paymentMethods: RestaurantPaymentMethod[] = [];

  facilities: RestaurantFacility[] = [];

  socialMedias: RestaurantSocialMedia[] = [];

  token: any;

  // Services
  restaurantService = inject(Restaurant2Service);
  reviewService = inject(ReviewService);
  revieWVotesService = inject(ReviewVotesService);
  workingHoursService = inject(WorkingHoursService);
  menuCategoryService = inject(MenuCategoryService);
  menuItemService = inject(MenuItemService);
  tableService = inject(TableService);
  restaurantTagService = inject(RestaurantTagService);
  restaurantPaymentMethodService = inject(RestaurantPaymentMethodService);
  restaurantFacilitiesService = inject(RestaurantFacilitiesService);
  restaurantSocialMediasService = inject(RestaurantSocialMediaService);
  tokenService = inject(TokenService);

  titleService = inject(Title);
  route = inject(ActivatedRoute);
  router = inject(Router);

  userRole: string = '';

  selectedRestaurant: Restaurant | null = null;

  selectedMenuCategory: MenuCategory | null = null;

  selectedMenuItem: MenuItem | null = null;

  selectedMenuCategoryId: number = 0;
  selectedMenuItemId: number = 0;

  selectedMenuCategoryDelete: MenuCategory | null = null;
  selectedMenuItemDelete: MenuItem | null = null;

  selectedWorkingDays: WorkingHours[] | null = null;

  selectedRestaurantLocation: RestaurantLocation | null = null;

  selectedTable: Table | null = null;

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.params['id'];
    this.token = this.tokenService.getUser();

    this.fetchRestaurant();
    this.fetchReviews();
    this.fetchMenuCategories();
    this.fetchMenuItems();
    this.fetchWorkingHours();
    this.fetchTables();
    this.fetchTags();
    this.fetchPaymentMethods();
    this.fetchFacilities();
    this.fetchSocialMedias();
  }

  isOwnerOrAdmin: boolean = false;

  checkUserAuthorizationAndRole(restaurantOwnerId: number): void {
    const token = this.tokenService.getToken();
    if (token) {
      const userId = this.tokenService.getUser()?.sub;
      console.log(userId);
      this.userRole = this.tokenService.getUserRole(token);

      console.log('Admin', this.userRole == 'Admin');
      console.log('Owner', this.userRole == 'Owner');
      console.log('User', this.userRole == 'User');
      console.log('userRole', this.userRole);

      this.isOwnerOrAdmin =
        (this.userRole == 'Owner' && userId == restaurantOwnerId) ||
        this.userRole == 'Admin';
      console.log('isOwnerOrAdmin', this.isOwnerOrAdmin);

      const isEditPage = this.router.url.includes('/edit/restaurants');
      const shouldRedirectToNotAuthorized = isEditPage && !this.isOwnerOrAdmin;
      const shouldRedirectToEditPage = !isEditPage && this.isOwnerOrAdmin;

      if (shouldRedirectToNotAuthorized) {
        this.router.navigate(['not-authorized']);
      } else if (shouldRedirectToEditPage) {
        this.router.navigate(['edit/restaurants', this.restaurantId]);
      }
    } else {
      console.error('No valid token found');
    }
  }

  fetchRestaurant() {
    this.restaurantService.getById(this.restaurantId).subscribe({
      next: (x) => {
        this.checkUserAuthorizationAndRole(x.ownerId);

        this.restaurant = x;
        if (
          this.restaurant.latitude != null &&
          this.restaurant.longitude != null
        ) {
          this.restaurantLocation = {
            latitude: x.latitude,
            longitude: x.longitude,
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
    for (let i = 0; i < this.reviews.length; i++) {
      this.revieWVotesService
        .getReviewVotesByReview(this.reviews[i].reviewID)
        .subscribe((data) => {
          if (data == null || data.length == 0) return;
          this.reviewVotesArray[i] = data;
          for (let j = 0; j < this.reviewVotesArray![i].length; j++) {
            this.fetchLikesDislikes(
              this.reviewVotesArray![i][j].reviewID,
              this.reviewVotesArray![i][j].isLike
            );
          }
        });
    }
  }

  fetchLikesDislikes(reviewID: number, isLike: boolean): number {
    var count = 0;
    for (let i = 0; i < this.reviewVotesArray.length; i++) {
      for (let j = 0; j < this.reviewVotesArray[i].length; j++) {
        if (
          this.reviewVotesArray[i][j].reviewID == reviewID &&
          this.reviewVotesArray[i][j].isLike == isLike
        )
          count++;
      }
    }
    return count;
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

  filteredTables(seats: number) {
    return this.tables.filter((t) => t.seats == seats);
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
      this.uniqueSeats = [...new Set(this.tables.map((table) => table.seats))];
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

  fetchFacilities() {
    this.restaurantFacilitiesService.getAll().subscribe((x) => {
      this.facilities = x
        .filter((rf) => rf.restaurantID == this.restaurantId)
        .map((rf) => {
          return {
            restaurantFacilitiesID: rf.restaurantFacilitiesID,
            restaurantID: rf.restaurantID,
            facilitiesID: rf.facilitiesID,
            dateAdded: rf.dateAdded.toString(),
            isActive: rf.isActive,
          };
        });
      console.log('facilities: ', this.facilities);
    });
  }

  fetchSocialMedias() {
    this.restaurantSocialMediasService.getAll().subscribe((x) => {
      this.socialMedias = x
        .filter((rsm) => rsm.restaurantID == this.restaurantId)
        .map((rsm) => {
          return {
            restaurantSocialMediaID: rsm.restaurantSocialMediaID,
            restaurantID: rsm.restaurantID,
            socialMediaID: rsm.socialMediaID,
            link: rsm.link,
          };
        });
      console.log('social medias: ', this.socialMedias);
    });
  }

  createMenuCategory(categoryType: number) {
    this.selectedMenuCategory = {
      id: 0,
      name: '',
      categoryType: categoryType,
    };
  }
  updateMenuCategory(menuCategory: MenuCategory) {
    this.selectedMenuCategory = {
      id: menuCategory.id,
      name: menuCategory.name,
      categoryType: menuCategory.categoryType,
    };
  }
  deleteMenuCategory(menuCategory: MenuCategory) {
    this.selectedMenuCategoryDelete = menuCategory;
  }

  createMenuItem(menuCategoryId: number) {
    this.selectedMenuItem = {
      id: 0,
      name: '',
      price: 0,
      description: null,
      menuCategoryId: menuCategoryId,
    };
  }
  updateMenuItem(menuItem: MenuItem) {
    this.selectedMenuItem = {
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      description: menuItem.description,
      menuCategoryId: menuItem.menuCategoryId,
    };
  }
  deleteMenuItem(menuItem: MenuItem) {
    this.selectedMenuItemDelete = menuItem;
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

  closeAndFetchRestaurantTags() {
    this.fetchTags();
  }

  closeAndFetchRestaurantPaymentMethods() {
    this.fetchPaymentMethods();
  }

  closeAndFetchFacilities() {
    this.fetchFacilities();
  }

  closeAndFetchSocialMedias() {
    this.fetchSocialMedias();
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
    if (!this.token) {
      alert("You can't leave a like if you're not logged in");
      return;
    }
    const reviewVoteDto: ReviewVotesCreateDto = {
      userID: +this.token.sub,
      reviewID: reviewId,
      isLike: isLike,
    };

    this.revieWVotesService.postReviewVote(reviewVoteDto).subscribe({
      next: (response) => {
        alert('Review vote submitted successfully!');
        console.log(response);
      },
      error: (error) => {
        console.log(error.error.message);
        this.reviewVotesArray.forEach((revievVotes) => {
          revievVotes.forEach((reviewVote) => {
            if (
              reviewVote.reviewID == reviewId &&
              reviewVote.userID == this.token.sub
            ) {
              this.revieWVotesService
                .updateReviewVote(reviewVote.reviewVotesID, reviewVoteDto)
                .subscribe({
                  next: (response) => {
                    alert('Review vote updated successfully!');
                    console.log(response);
                  },
                  error: (error) => {
                    alert(
                      'Failed to update review vote. Please try again.' +
                        '\n' +
                        error.error.message
                    );
                    console.log(error.error.message);
                  },
                });
            }
          });
        });
      },
    });

    setTimeout(() => {
      this.fetchReviewVotes();
    }, 1000);
  }

  updateWorkingHours() {
    this.selectedWorkingDays = this.workingDays.map((hour) => ({
      ...hour,
      openTime: `${hour.openTime}:00`,
      closeTime: `${hour.closeTime}:00`,
    }));
  }

  updateMapLocation() {
    this.selectedRestaurantLocation! = {
      ...this.restaurantLocation,
    };
  }

  closeAndFetchLocation(updatedRestaurantLocation: RestaurantLocation) {
    this.restaurantLocation = {
      latitude: updatedRestaurantLocation.latitude,
      longitude: updatedRestaurantLocation.longitude,
    };

    if (
      this.restaurantLocation.latitude == 0 &&
      this.restaurantLocation.longitude == 0
    ) {
      this.restaurantService
        .deleteLocation(this.restaurantId)
        .subscribe((x) => {
          this.fetchRestaurant();
        });
    } else {
      this.restaurantService
        .updateLocation(this.restaurantId, this.restaurantLocation)
        .subscribe((x) => {
          this.fetchRestaurant();
        });
    }
  }

  closeAndFetchRestaurant() {
    this.fetchRestaurant();
  }

  closeAndFetchRestaurantImages() {
    this.imagesChanged = !this.imagesChanged;
  }

  closeAndFetchTables() {
    this.fetchTables();
  }

  updateRestaurantDetails() {
    this.selectedRestaurant = { ...this.restaurant! };
  }

  updateLogoImage() {
    this.selectedLogoImage = this.logoImageSrc;
  }

  updateTable(table: Table) {
    this.selectedTable = { ...table };
  }

  createTable() {
    this.selectedTable = {
      id: 0,
      tableNumber: 0,
      seats: 4,
      isFunctional: true,
    };
  }

  addHttpProtocol(url: string | null | undefined): string {
    if (!url) return '';

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'http://' + url;
    }

    return url;
  }
}
