import { Component } from '@angular/core';
import { Restaurant2Service, Restaurant } from '../../Services/restaurant2.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../Services/token.service';
import { CityService, City } from '../../Services/city.service';
import { RestaurantTypeService, RestaurantType } from '../../Services/restaurant-type.service';

interface RestaurantResponse {
  count: number;
  resultList: Restaurant[];
}

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './owner-dashboard.component.html',
  styleUrl: './owner-dashboard.component.css'
})
export class OwnerDashboardComponent {
  restaurantForm: FormGroup;
  userRestaurants: Restaurant[] = [];
  cities: City[] = [];
  restaurantTypes: RestaurantType[] = [];

  constructor(
    private restaurantService: Restaurant2Service,
    private fb: FormBuilder,
    private tokenService: TokenService,
    private cityService: CityService,
    private restaurantTypeService: RestaurantTypeService
  ) {
    this.restaurantForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      contactNumber: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      street: ['', Validators.required],
      cityId: [0, Validators.required],
      restaurantTypeId: [0, Validators.required],
      webSite: [''],
      latitude: [0],
      longitude: [0]
    });
    this.loadOwnerRestaurants();
    this.loadCities();
    this.loadRestaurantTypes();
  }

  loadOwnerRestaurants() {
    const userId = this.tokenService.getUser().sub;
    // console.log('Imal ga:' + userId);
    this.restaurantService.getAllByUserId({ OwnerId: userId }).subscribe({
      next: (response: RestaurantResponse) => {
        this.userRestaurants = response.resultList;
      },
      error: (error) => {
        console.error('Error loading restaurants', error);
      }
    });
  }
  
  onSubmit() {
    if (this.restaurantForm.valid) {
      const restaurantData = {
        ...this.restaurantForm.value,
        ownerId: this.tokenService.getUser().sub
        };
      
      this.restaurantService.create(restaurantData).subscribe({
        next: (response) => {
          console.log('Restaurant created successfully', response);
          this.restaurantForm.reset();
          this.loadOwnerRestaurants();
          alert('Restaurant created successfully');
        },
        error: (error) => {
          console.error('Error creating restaurant', error);
          alert('Error creating restaurant');
        }
      });
    }
  }

  deleteRestaurant(restaurantId: number) {
    if(confirm('Are you sure you want to delete this restaurant?')) {
      this.restaurantService.delete(restaurantId).subscribe({
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

  loadCities(): void {
    this.cityService.getAll().subscribe({
      next: (data) => {
        this.cities = data.resultList;
        console.log('Cities loaded:', this.cities);
      },
      error: (error) => {
        console.error('Error loading cities:', error);
      }
    });
  }

  loadRestaurantTypes(): void {
    this.restaurantTypeService.getAll().subscribe({
      next: (data) => {
        this.restaurantTypes = data.resultList;
        console.log('Restaurant types loaded:', this.restaurantTypes);
      },
      error: (error) => {
        console.error('Error loading restaurant types:', error);
      }
    });
  }
}
