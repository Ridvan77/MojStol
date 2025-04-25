import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../../Services/token.service';

@Component({
    selector: 'app-two-factor-auth',
    imports: [FormsModule, CommonModule],
    templateUrl: './two-factor-auth.component.html',
    styleUrls: ['./two-factor-auth.component.css']
})
export class TwoFactorAuthComponent {
  @Input() userId: number | null = null;
  @Input() userEmail: string = '';
  twoFactorCode: string = '';
  
  @Output() verified = new EventEmitter<void>();
  
  constructor(private authService: AuthService, private router: Router, private tokenService: TokenService  ) {}

  onVerify2FA() {
    if (this.userId && this.twoFactorCode) {
      this.authService.verify2FA({ userId: this.userId, twoFactorCode: this.twoFactorCode }).subscribe(
        (response: any) => {
          localStorage.setItem('authToken', response.token);
          const userRole = this.tokenService.getUserRole(response.token);
          if (userRole === 'Admin') {
            this.router.navigate(['/admin/dashboard']); 
          }
          else if (userRole === 'Owner') {
            this.router.navigate(['/owner/dashboard']); 
          } 
          else if (userRole === 'User') {
            this.router.navigate(['/']); 
          } else {
            alert('Unauthorized role!');
          }
          alert('Login successful!');
          this.verified.emit();  
        },
        (error) => {
          alert('Invalid or expired 2FA code!');
        }
      );
    } else {
      alert('Please enter the 2FA code.');
    }
  }


  onResendCode() {
    if (this.userEmail) {
      this.authService.resend2FACode(this.userEmail).subscribe(
        () => {
          alert('New code has been sent to your email address.');
        },
        (error) => {
          alert('Error sending new code.');
        }
      );
    } else {
      alert('Email address is not available.');
    }
  }
}
