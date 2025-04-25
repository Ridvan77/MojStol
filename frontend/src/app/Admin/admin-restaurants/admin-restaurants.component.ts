import { Component, OnInit } from '@angular/core';
import { Restaurant2Service } from '../../Services/restaurant2.service';
import { Restaurant } from '../../Services/restaurant2.service';
import { CommonModule } from '@angular/common';
import { PagedResult } from '../../Services/paged-result.interface';
import { Router, RouterModule } from '@angular/router';
import {
  RestaurantTypeService,
  RestaurantType,
} from '../../Services/restaurant-type.service';
import { FormsModule } from '@angular/forms';
import { City, CityService } from '../../Services/city.service';
import { Tag, TagService } from '../../Services/tag.service';
import {
  PaymentMethod,
  PaymentMethodService,
} from '../../Services/payment-method.service';
import { FacilitiesService, Facility } from '../../Services/facilities.service';

@Component({
  selector: 'app-admin-restaurants',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-restaurants.component.html',
  styleUrl: './admin-restaurants.component.css',
})
export class AdminRestaurantsComponent implements OnInit {
  restaurants: Restaurant[] = [];
  restaurantTypes: RestaurantType[] = [];
  cities: City[] = [];
  tags: Tag[] = [];
  paymentMethods: PaymentMethod[] = [];
  facilities: Facility[] = [];

  selectedTypeId: string = '';
  selectedCityId: string = '';
  selectedOwnerId: string = '';
  selectedTagIds: number[] = [];
  selectedPaymentMethodIds: number[] = [];
  selectedFacilityIds: number[] = [];
  searchName: string = '';
  isDescending: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 10;

  constructor(
    private restaurantService: Restaurant2Service,
    private restaurantTypeService: RestaurantTypeService,
    private cityService: CityService,
    private tagService: TagService,
    private paymentMethodService: PaymentMethodService,
    private facilitiesService: FacilitiesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchRestaurants();
    this.fetchRestaurantTypes();
    this.fetchCities();
    this.fetchTags();
    this.fetchPaymentMethods();
    this.fetchFacilities();
  }

  fetchRestaurants(): void {
    const params: any = {};

    if (this.selectedTypeId) {
      params.RestaurantTypeId = this.selectedTypeId;
    }
    if (this.selectedCityId) {
      params.CityId = this.selectedCityId;
    }
    if (this.selectedOwnerId) {
      params.OwnerId = this.selectedOwnerId;
    }
    if (this.searchName) {
      params.RestaurantName = this.searchName;
    }
    if (this.selectedTagIds.length > 0) {
      params.TagIds = this.selectedTagIds;
    }
    if (this.selectedPaymentMethodIds.length > 0) {
      params.PaymentMethodIds = this.selectedPaymentMethodIds;
    }
    if (this.selectedFacilityIds.length > 0) {
      params.FacilityIds = this.selectedFacilityIds;
    }

    console.log(params);

    this.restaurantService.getAllWithParams(params).subscribe(
      (response) => {
        this.restaurants = response.resultList;
        console.log(this.restaurants);
      },
      (error) => {
        console.error('Error fetching restaurants:', error);
      }
    );
  }

  fetchRestaurantTypes(): void {
    this.restaurantTypeService.getAll().subscribe(
      (response) => {
        this.restaurantTypes = response.resultList;
      },
      (error) => {
        console.error('Error fetching restaurant types:', error);
      }
    );
  }

  fetchCities(): void {
    this.cityService.getAll().subscribe(
      (response) => {
        this.cities = response.resultList;
      },
      (error) => {
        console.error('Error fetching cities:', error);
      }
    );
  }

  fetchTags(): void {
    this.tagService.getAllTags().subscribe(
      (tags) => {
        this.tags = tags;
      },
      (error) => {
        console.error('Error fetching tags:', error);
      }
    );
  }

  fetchPaymentMethods(): void {
    this.paymentMethodService.getAll().subscribe(
      (paymentMethods) => {
        this.paymentMethods = paymentMethods;
      },
      (error) => {
        console.error('Error fetching payment methods:', error);
      }
    );
  }

  fetchFacilities(): void {
    this.facilitiesService.getAllFacilities().subscribe(
      (facilities) => {
        this.facilities = facilities;
      },
      (error) => {
        console.error('Error fetching facilities:', error);
      }
    );
  }

  toggleTagSelection(tagId: number): void {
    const index = this.selectedTagIds.indexOf(tagId);
    if (index === -1) {
      this.selectedTagIds.push(tagId);
    } else {
      this.selectedTagIds.splice(index, 1);
    }
    this.fetchRestaurants();
  }

  togglePaymentMethodSelection(paymentMethodId: number): void {
    const index = this.selectedPaymentMethodIds.indexOf(paymentMethodId);
    if (index === -1) {
      this.selectedPaymentMethodIds.push(paymentMethodId);
    } else {
      this.selectedPaymentMethodIds.splice(index, 1);
    }
    this.fetchRestaurants();
  }

  toggleFacilitySelection(facilityId: number): void {
    const index = this.selectedFacilityIds.indexOf(facilityId);
    if (index === -1) {
      this.selectedFacilityIds.push(facilityId);
    } else {
      this.selectedFacilityIds.splice(index, 1);
    }
    this.fetchRestaurants();
  }

  clearFilters(): void {
    this.selectedTypeId = '';
    this.selectedCityId = '';
    this.selectedOwnerId = '';
    this.selectedTagIds = [];
    this.selectedPaymentMethodIds = [];
    this.selectedFacilityIds = [];
    this.searchName = '';
    this.isDescending = false;
    this.fetchRestaurants();
  }

  deleteRestaurant(id: number) {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      this.restaurantService.delete(id).subscribe(
        (response) => {
          console.log('Restaurant deleted successfully:', response);
          this.fetchRestaurants();
        },
        (error) => {
          console.error('Error deleting restaurant:', error);
        }
      );
    }
  }

  addHttpProtocol(url: string | null | undefined): string {
    if (!url) return '';

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'http://' + url;
    }

    return url;
  }
}
