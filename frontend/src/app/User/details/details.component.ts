import { Component, OnInit } from '@angular/core';
import { UserDto, UserService } from '../../Services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../Services/token.service';

export interface UserFullDto extends UserDto {
  email: string;
  username: string;
  roleId: number;
  role: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-details',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  user: UserFullDto | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  userId: number | null = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    if (this.userId) {
      this.fetchUserById(+this.userId);
    } else {
      this.error = 'User ID not provided';
      this.isLoading = false;
    }
  }

  fetchUserById(userId: number): void {
    this.userService.getUserById(userId).subscribe({
      next: (data) => {
        this.user = data as UserFullDto;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching user details', error);
        this.error = 'Error fetching user details';
        this.isLoading = false;
      }
    });
  }

  updateUser(): void {
    if (!this.user) return;

    const token = this.tokenService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const currentUserRole = this.tokenService.getUserRole(token);
    const currentUserId = this.tokenService.decodeToken(token)?.sub;


    const updateUserDto = {
      name: this.user.name,
      surname: this.user.surname,
      phoneNumber: this.user.phoneNumber,
      dateOfBirth: this.user.dateOfBirth
    };

    this.userService.updateUser(this.user.userId, updateUserDto).subscribe({
      next: () => {
        alert('User details updated successfully');
        
        if (currentUserRole === 'Admin') {
          if (this.user?.roleId === 2) {
            this.router.navigate(['/admin/users']);
          } else {
            this.router.navigate(['/admin/owners']);
          }
        } else {
          this.router.navigate([`/user-detail/${currentUserId}`]);
        }
      },
      error: (err) => {
        console.error('Error updating user', err);
        alert('Failed to update user details');
      }
    });
  }

  deleteUser(): void {
    if (!this.user) return;

    if (confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      this.isLoading = true;
      
      this.userService.deleteUser(this.user.userId).subscribe({
        next: () => {
          alert('Account successfully deleted');
          const token = this.tokenService.getToken();
          if (token) {
            const currentUserId = this.tokenService.decodeToken(token)?.sub;
            if (currentUserId === this.userId) {
              console.log('User is deleting their own account');
              this.tokenService.signOut(); 
              this.router.navigate(['/']);
            } else {
              console.log('Admin is deleting another user');
              this.router.navigate(['/admin/users']);
            }
          }
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.error = 'Failed to delete account. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  getRoleName(roleId: number): string {
    switch (roleId) {
      case 1: return 'Admin';
      case 2: return 'User';
      case 3: return 'Owner';
      default: return 'Unknown';
    }
  }
}
