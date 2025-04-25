import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Restaurant2Service, Restaurant } from '../../Services/restaurant2.service';
import { RestaurantTypeService, RestaurantType } from '../../Services/restaurant-type.service';
import { CityService, City } from '../../Services/city.service';
import { TagService, Tag } from '../../Services/tag.service';
import { PaymentMethodService, PaymentMethod } from '../../Services/payment-method.service';
import { FacilitiesService, Facility } from '../../Services/facilities.service';
import { TokenService } from '../../Services/token.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface RestaurantResponse {
  count: number;
  resultList: Restaurant[];
}

@Component({
  selector: 'app-owner-restaurants',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './owner-restaurants.component.html',
  styleUrl: './owner-restaurants.component.css'
})
export class OwnerRestaurantsComponent implements OnInit {
  userRestaurants: Restaurant[] = [];
  restaurantTypes: RestaurantType[] = [];
  cities: City[] = [];
  tags: Tag[] = [];
  paymentMethods: PaymentMethod[] = [];
  facilities: Facility[] = [];

  // Filter variables
  searchName: string = '';
  selectedTypeId: string = '';
  selectedCityId: string = '';
  selectedRating: string = '';
  selectedTagIds: number[] = [];
  selectedPaymentMethodIds: number[] = [];
  selectedFacilityIds: number[] = [];
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
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.loadOwnerRestaurants();
    this.loadRestaurantTypes();
    this.loadCities();
    this.loadTags();
    this.loadPaymentMethods();
    this.loadFacilities();
  }

  loadRestaurantTypes() {
    this.restaurantTypeService.getAll().subscribe({
      next: (response) => this.restaurantTypes = response.resultList,
      error: (error) => console.error('Error loading restaurant types', error)
    });
  }

  loadCities() {
    this.cityService.getAll().subscribe({
      next: (response) => this.cities = response.resultList,
      error: (error) => console.error('Error loading cities', error)
    });
  }

  loadTags() {
    this.tagService.getAllTags().subscribe({
      next: (tags) => this.tags = tags,
      error: (error) => console.error('Error loading tags', error)
    });
  }

  loadPaymentMethods() {
    this.paymentMethodService.getAll().subscribe({
      next: (paymentMethods) => this.paymentMethods = paymentMethods,
      error: (error) => console.error('Error loading payment methods', error)
    });
  }

  loadFacilities() {
    this.facilitiesService.getAllFacilities().subscribe({
      next: (facilities) => this.facilities = facilities,
      error: (error) => console.error('Error loading facilities', error)
    });
  }

  loadOwnerRestaurants() {
    const userId = this.tokenService.getUser().sub;
    const params: any = { OwnerId: userId };

    if (this.searchName) params.RestaurantName = this.searchName;
    if (this.selectedTypeId) params.RestaurantTypeId = this.selectedTypeId;
    if (this.selectedCityId) params.CityId = this.selectedCityId;
    if (this.selectedRating) params.MinRating = this.selectedRating;
    if (this.selectedTagIds.length > 0) params.TagIds = this.selectedTagIds;
    if (this.selectedPaymentMethodIds.length > 0) params.PaymentMethodIds = this.selectedPaymentMethodIds;
    if (this.selectedFacilityIds.length > 0) params.FacilityIds = this.selectedFacilityIds;

    this.restaurantService.getAllByUserId(params).subscribe({
      next: (response: RestaurantResponse) => {
        this.userRestaurants = response.resultList;
        console.log(this.userRestaurants);
      },
      error: (error) => {
        console.error('Error loading restaurants', error);
      }
    });
  }

  getAverageRating(): number | null {
    if (this.userRestaurants.length === 0) return null;
        const restaurantsWithRating = this.userRestaurants.filter(restaurant => restaurant.averageRating);
        if (restaurantsWithRating.length === 0) return null;
    const totalRating = restaurantsWithRating.reduce((sum, restaurant) => 
      sum + restaurant.averageRating, 0);
    return Number((totalRating / restaurantsWithRating.length).toFixed(1));
  }

  toggleTagSelection(tagId: number): void {
    const index = this.selectedTagIds.indexOf(tagId);
    if (index === -1) {
      this.selectedTagIds.push(tagId);
    } else {
      this.selectedTagIds.splice(index, 1);
    }
    this.loadOwnerRestaurants();
  }

  togglePaymentMethodSelection(paymentMethodId: number): void {
    const index = this.selectedPaymentMethodIds.indexOf(paymentMethodId);
    if (index === -1) {
      this.selectedPaymentMethodIds.push(paymentMethodId);
    } else {
      this.selectedPaymentMethodIds.splice(index, 1);
    }
    this.loadOwnerRestaurants();
  }

  toggleFacilitySelection(facilityId: number): void {
    const index = this.selectedFacilityIds.indexOf(facilityId);
    if (index === -1) {
      this.selectedFacilityIds.push(facilityId);
    } else {
      this.selectedFacilityIds.splice(index, 1);
    }
    this.loadOwnerRestaurants();
  }

  clearFilters() {
    this.searchName = '';
    this.selectedTypeId = '';
    this.selectedCityId = '';
    this.selectedTagIds = [];
    this.selectedPaymentMethodIds = [];
    this.selectedFacilityIds = [];
    this.isDescending = false;
    this.loadOwnerRestaurants();
  }

  deleteRestaurant(id: number) {
    if(confirm('Are you sure you want to delete this restaurant?')) {
      this.restaurantService.delete(id).subscribe({
        next: () => {
          this.loadOwnerRestaurants();
          alert('Restaurant deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting restaurant', error);
          alert('Error deleting restaurant');
        }
      });
    }
  }
}
