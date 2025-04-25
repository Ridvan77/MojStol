import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../Services/token.service';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  isLoggedIn: boolean = false;
    userName: string = '';
    userId: string = '';

    constructor(
      @Inject(PLATFORM_ID) private platformId: Object,
      private router: Router,
      private tokenService: TokenService
    ) {}
  
    ngOnInit(): void {
      // Check if running in the browser
      if (isPlatformBrowser(this.platformId)) {
        const token = localStorage.getItem('authToken');
  
        if (token && !this.tokenService.isTokenExpired(token)) {
          this.isLoggedIn = true;
          const decodedToken = this.tokenService.decodeToken(token);
  
          this.userName = decodedToken.Name || 'User';
          this.userId = decodedToken.sub;
        } else {
          this.isLoggedIn = false;
        }
      }
    }
  
    logout(): void {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('authToken');
        this.isLoggedIn = false;
      }
      this.router.navigate(['/']);
    }

}
