import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { EngagementSectionComponent } from '../../Public/engagement-section/engagement-section.component';
import { City, CityService } from '../../Services/city.service';
import { FacilitiesService, Facility } from '../../Services/facilities.service';
import {
  PaymentMethod,
  PaymentMethodService,
} from '../../Services/payment-method.service';
import {
  RestaurantType,
  RestaurantTypeService,
} from '../../Services/restaurant-type.service';
import {
  Restaurant,
  Restaurant2Service,
} from '../../Services/restaurant2.service';
import { Tag, TagService } from '../../Services/tag.service';
import { StarsRatingComponent } from '../stars-rating/stars-rating.component';
import {
  FavouritesService,
  FavouriteCreateDto,
} from '../../Services/favourites.service';
import { TokenService } from '../../Services/token.service';

@Component({
  selector: 'app-restaurant-list',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    StarsRatingComponent,
    TranslateModule,
    EngagementSectionComponent,
  ],
  templateUrl: './restaurant-list.component.html',
  styleUrl: './restaurant-list.component.css',
})
export class RestaurantListComponent implements OnInit {
  typeList: RestaurantType[] = [];
  selectedRestaurantType: RestaurantType = { id: '0', name: 'Sve kategorije' };

  selectedCity: City = { id: '0', name: 'Svi gradovi' };
  cityList: City[] = [];

  tagList: Tag[] = [];
  paymentMethodList: PaymentMethod[] = [];
  facilityList: Facility[] = [];

  selectedTags: number[] = [];
  selectedPaymentMethods: number[] = [];
  selectedFacilities: number[] = [];

  restaurantList: Restaurant[] = [];
  pageNumber: number = 1;
  pageSize: number = 9;
  totalCount: number = 0;
  totalPages: number = 0;
  user: any;

  restaurantService = inject(Restaurant2Service);
  cityService = inject(CityService);
  restaurantTypeService = inject(RestaurantTypeService);
  tagService = inject(TagService);
  paymentMethodService = inject(PaymentMethodService);
  facilitiesService = inject(FacilitiesService);
  favouriteService = inject(FavouritesService);
  tokenService = inject(TokenService);

  titleService = inject(Title);
  route = inject(ActivatedRoute);

  cityId: any;
  restaurantTypeId: any;

  ngOnInit(): void {
    this.user = this.tokenService.getUser();

    this.cityId = this.route.snapshot.queryParams['cityId'];
    this.restaurantTypeId = this.route.snapshot.queryParams['typeId'];

    console.log(this.cityId);
    console.log(this.restaurantTypeId);

    console.log(this.selectedTags);
    console.log(this.selectedPaymentMethods);
    console.log(this.selectedFacilities);

    this.fetchTags();
    this.fetchPaymentMethods();
    this.fetchFacilities();

    forkJoin([
      this.cityService.getAll(),
      this.restaurantTypeService.getAll(),
      this.paymentMethodService.getAll(),
      this.facilitiesService.getAllFacilities(),
    ]).subscribe(([cityResponse, restaurantTypeResponse]) => {
      this.cityList = [
        { id: '0', name: 'Svi gradovi' },
        ...cityResponse.resultList,
      ];
      this.typeList = [
        { id: '0', name: 'Sve kategorije' },
        ...restaurantTypeResponse.resultList,
      ];

      const city = this.cityList.find((c) => c.id == this.cityId);
      this.selectedCity = city || this.cityList[0];

      const type = this.typeList.find((rt) => rt.id == this.restaurantTypeId);
      this.selectedRestaurantType = type || this.typeList[0];

      this.fetchRestaurants();
    });

    this.titleService.setTitle('Spisak restorana');
  }

  fetchRestaurants() {
    const params: any = {
      PageNumber: this.pageNumber,
      PageSize: this.pageSize,
    };

    console.log(this.selectedCity);
    console.log(this.selectedRestaurantType);

    if (this.selectedCity.id != '0') {
      params.CityId = this.selectedCity.id;
    }
    if (this.selectedRestaurantType?.id != '0') {
      params.RestaurantTypeId = this.selectedRestaurantType?.id;
    }

    if (this.selectedTags && this.selectedTags.length > 0) {
      params.TagIds = this.selectedTags;
    }
    if (this.selectedPaymentMethods && this.selectedPaymentMethods.length > 0) {
      params.PaymentMethodIds = this.selectedPaymentMethods;
    }
    if (this.selectedFacilities && this.selectedFacilities.length > 0) {
      params.FacilityIds = this.selectedFacilities;
    }

    console.log('Params:', params);

    this.restaurantService.getAllWithParams(params).subscribe((x) => {
      this.restaurantList = x.resultList;
      this.totalCount = x.count;
      this.totalPages = Math.ceil(this.totalCount / this.pageSize);

      console.log(this.restaurantList);
      console.log(this.totalCount);
      console.log(this.totalPages);
    });

    window.scrollTo(0, 0);
  }

  fetchCities() {
    this.cityService.getAll().subscribe((x) => {
      this.cityList = [{ id: '0', name: 'Svi gradovi' }, ...x.resultList];
    });
  }

  fetchRestaurantTypes() {
    this.restaurantTypeService.getAll().subscribe((x) => {
      this.typeList = [{ id: '0', name: 'Sve kategorije' }, ...x.resultList];
    });
  }

  fetchTags() {
    this.tagService.getAllTags().subscribe((tags) => {
      this.tagList = tags;
    });
  }

  fetchPaymentMethods() {
    this.paymentMethodService.getAll().subscribe((paymentMethods) => {
      this.paymentMethodList = paymentMethods;
    });
  }

  fetchFacilities() {
    this.facilitiesService.getAllFacilities().subscribe((facilities) => {
      this.facilityList = facilities;
    });
  }

  selectCity(city: City) {
    if (this.selectedCity == city) return;

    this.selectedCity = city;
    this.pageNumber = 1;
    this.fetchRestaurants();
  }

  selectRestaurantType(restaurantType: RestaurantType) {
    if (this.selectedRestaurantType == restaurantType) return;

    this.selectedRestaurantType = restaurantType;
    this.pageNumber = 1;
    this.fetchRestaurants();
  }

  toggleTagSelection(tagId: number): void {
    const index = this.selectedTags.indexOf(tagId);

    if (index == -1) {
      this.selectedTags.push(tagId);
    } else {
      this.selectedTags.splice(index, 1);
    }

    console.log('Selected Tags:', this.selectedTags);
    this.pageNumber = 1;
    this.fetchRestaurants();
  }
  togglePaymentMethodSelection(paymentMethodId: number): void {
    const index = this.selectedPaymentMethods.indexOf(paymentMethodId);

    if (index == -1) {
      this.selectedPaymentMethods.push(paymentMethodId);
    } else {
      this.selectedPaymentMethods.splice(index, 1);
    }

    console.log('Selected Payment Methods:', this.selectedPaymentMethods);
    this.pageNumber = 1;
    this.fetchRestaurants();
  }
  toggleFacilitySelection(facilityId: number): void {
    const index = this.selectedFacilities.indexOf(facilityId);

    if (index == -1) {
      this.selectedFacilities.push(facilityId);
    } else {
      this.selectedFacilities.splice(index, 1);
    }

    console.log('Selected Facilities:', this.selectedFacilities);
    this.pageNumber = 1;
    this.fetchRestaurants();
  }

  clearFilters() {
    this.selectedCity = this.cityList[0];
    this.selectedRestaurantType = this.typeList[0];
    this.pageNumber = 1;

    this.selectedTags = [];
    this.selectedPaymentMethods = [];
    this.selectedFacilities = [];

    this.fetchRestaurants();
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.fetchRestaurants();
    }
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.fetchRestaurants();
    }
  }

  goToPage(page: number) {
    if (page != this.pageNumber && page > 0 && page <= this.totalPages) {
      this.pageNumber = page;
      this.fetchRestaurants();
    }
  }

  addFavourite(id: string) {
    if (!this.user) {
      alert("You can't add to favourites because you are not logged in!");
      return;
    }
    var favouriteDto: FavouriteCreateDto = {
      userID: this.user.sub,
      restaurantID: parseInt(id),
    };
    this.favouriteService.addFavourite(favouriteDto).subscribe({
      next: (response) => {
        console.log('Restaurant added to favourites successfully', response);
        alert('Restaurant added to favourties successfully');
      },
      error: (error) => {
        alert('Failed to add restaurant to favourites\n' + error.error.message);
        console.error('Error adding restaurant to favourites:', error);
      },
    });
  }
}
