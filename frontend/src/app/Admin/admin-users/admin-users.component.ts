import { Component, OnInit } from '@angular/core';
import { UserService, UserDto } from '../../Services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {


  users: UserDto[] = [];
  searchQuery: string = ''; 
  activeUsersCount: number = 0;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(nameSurname?: string): void {
    const roleId = 2;  // Just where roleId = 2 (user)
    this.userService.getAllUsers(nameSurname, roleId).subscribe({
      next: (data) => {
        this.users = data;  
        this.activeUsersCount = this.users.filter(user => user.isActive).length;
      },
      error: (error) => {
        console.error('Error fetching users', error);
      }
    });
  }

  searchUsers(): void {
    this.fetchUsers(this.searchQuery); 
  }


  viewUserDetail(userId: number): void {
    this.router.navigate([`/user-detail/${userId}`]);
  }


}
