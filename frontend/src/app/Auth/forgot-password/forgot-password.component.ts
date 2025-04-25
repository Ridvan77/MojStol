import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';

@Component({
    selector: 'app-forgot-password',
    imports: [FormsModule, CommonModule],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';

  @Output() close = new EventEmitter<void>(); // salje parentu

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (this.email) {
      this.authService.forgotPassword(this.email).subscribe(
        () => {
          alert('Reset password link sent to your email!');
          this.close.emit();
        },
        (error) => {
          alert('Failed to send reset link. Please try again.');
        }
      );
    } else {
      alert('Please enter a valid email address.');
    }
  }

  onClose() {
    this.close.emit();
  }
}
