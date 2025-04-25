import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { Router, RouterModule } from '@angular/router';
import { Restaurant2Service } from '../../Services/restaurant2.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  usersCount: number = 0;
  ownersCount: number = 0;
  restaurantsCount: number = 0;

  constructor(private userService: UserService, private router: Router, private restaurantService: Restaurant2Service  ) {}

  ngOnInit(): void {
    this.userService.getActiveUsersAndOwnersCount().subscribe(
      (counts) => {
        this.usersCount = counts.usersCount;
        this.ownersCount = counts.ownersCount;
      },
      (error) => {
        console.error('Error fetching active users and owners count:', error);
      }
    );

    this.restaurantService.getAll().subscribe(
      (response) => {
        this.restaurantsCount = response.count;
      },
      (error) => {
        console.error('Error fetching restaurant count:', error);
      }
    );
  }
}
  
