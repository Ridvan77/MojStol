import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TwoFactorAuthComponent } from '../two-factor-auth/two-factor-auth.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';


@Component({
    selector: 'app-login',
    imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule, TwoFactorAuthComponent, ForgotPasswordComponent],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  userId: number | null = null;
  show2FAPopup: boolean = false;
  showForgotPasswordModal: boolean = false;
  userEmail: string = '';
  showPassword: boolean = false;
  submitted = false;


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  getErrorMessage(field: string): string {
    if (this.f[field].hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }

    if (field === 'email' && this.f[field].hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (field === 'password' && this.f[field].hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }

    return '';
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe(
        (response: any) => {
          this.userId = response.userId;
          this.userEmail = this.loginForm.get('email')?.value;
          if (this.userId !== null) {
            this.show2FAPopup = true;
          } else {
            alert('Login failed: UserId not returned.');
          }
        },
        (error) => {
          if (error.status === 401) {
            alert('Invalid email or password');
          } else if (error.status === 404) {
            alert('User not found');
          } else {
            alert('An error occurred during login. Please try again.');
          }
        }
      );
    }
  }

  on2FAVerified() {
    this.show2FAPopup = false;
  }

    openForgotPasswordModal() {
      this.showForgotPasswordModal = true;
    }
  
    closeForgotPasswordModal() {
      this.showForgotPasswordModal = false;
    }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
