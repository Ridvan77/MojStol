import { Component, inject, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicNavbarComponent } from '../../Core/Navbar/public-navbar/public-navbar.component';
import { FooterComponent } from '../../Core/Footer/footer/footer.component';
import {
  Restaurant2Service,
  Restaurant,
} from '../../Services/restaurant2.service';
import { TokenService } from '../../Services/token.service';
import { CityService, City } from '../../Services/city.service';
import {
  RestaurantTypeService,
  RestaurantType,
} from '../../Services/restaurant-type.service';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { EngagementSectionComponent } from '../engagement-section/engagement-section.component';

@Component({
  selector: 'app-landing',
  imports: [
    CommonModule,
    PublicNavbarComponent,
    FooterComponent,
    RouterModule,
    EngagementSectionComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  route = inject(ActivatedRoute);
  tokenService = inject(TokenService);
  cityService = inject(CityService);
  restaurantTypeService = inject(RestaurantTypeService);
  userID = 0;
  selectedCity: number = 0;
  selectedCityName: string = '';
  selectedType: number = 0;
  selectedTypeName: string = '';
  cities: City[] = [];
  restaurantTypes: RestaurantType[] = [];

  restaurantService = inject(Restaurant2Service);
  bestRestaurants: Restaurant[] = [];
  mostVisitedRestaurants: Restaurant[] = [];
  mostVisitedRestaurantsByUserID: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');

      if (token && !this.tokenService.isTokenExpired(token)) {
        const decodedToken = this.tokenService.decodeToken(token);
        this.userID = parseInt(decodedToken.sub);
      }
    }

    // Fetch cities
    this.cityService.getAll().subscribe((response) => {
      this.cities = response.resultList;
    });

    // Fetch restaurant types
    this.restaurantTypeService.getAll().subscribe((response) => {
      this.restaurantTypes = response.resultList;
    });

    this.restaurantService.getAllByAverageRating().subscribe((x) => {
      this.bestRestaurants = x.resultList;
    });

    this.route.queryParams.subscribe((params) => {
      const cityId = params['cityId'] as string;
      const typeId = params['typeId'] as string;

      if (cityId && typeId) {
        // ... rest of the code stays the same
      }
    });

    this.restaurantService.getVisitAgainsDescending().subscribe((x) => {
      this.mostVisitedRestaurants = x;
      console.log('Most visted: ');
      console.log(this.mostVisitedRestaurants);
      console.log(this.mostVisitedRestaurants[0]);
    });

    if (this.userID != 0) {
      this.restaurantService
        .getVisitAgainsByUserId(this.userID)
        .subscribe((x) => {
          this.mostVisitedRestaurantsByUserID = x;
          console.log('Most visted by userID: ');
          console.log(this.mostVisitedRestaurantsByUserID);
          console.log(this.mostVisitedRestaurantsByUserID[0]);
        });
    }
  }

  onCitySelect(cityId: number, cityName: string) {
    this.selectedCity = cityId;
    this.selectedCityName = cityName;
  }

  onTypeSelect(typeId: number, typeName: string) {
    this.selectedType = typeId;
    this.selectedTypeName = typeName;
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

  findRestaurants() {
    if (this.selectedCity && this.selectedType) {
      this.router.navigate(['/restaurants'], {
        queryParams: {
          cityId: this.selectedCity,
          typeId: this.selectedType,
        },
      });
    } else {
      alert('Please select both city and restaurant type');
    }
  }
}
