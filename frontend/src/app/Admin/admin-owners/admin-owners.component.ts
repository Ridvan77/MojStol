import { Component, OnInit } from '@angular/core';
import { UserDto, UserService } from '../../Services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-owners',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-owners.component.html',
  styleUrl: './admin-owners.component.css'
})
export class AdminOwnersComponent implements OnInit {
  
  
    users: UserDto[] = [];
    searchQuery: string = ''; 
    activeOwnersCount: number = 0;
  
    constructor(private userService: UserService, private router: Router) {}
  
    ngOnInit(): void {
      this.fetchUsers();
    }
  
    fetchUsers(nameSurname?: string): void {
      const roleId = 3;  // Just where roleId = 2 (user)
      this.userService.getAllUsers(nameSurname, roleId).subscribe({
        next: (data) => {
          this.users = data;  
          this.activeOwnersCount = this.users.filter(user => user.isActive).length;
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
