import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TwoFactorAuthComponent } from '../../Auth/two-factor-auth/two-factor-auth.component';
import { ForgotPasswordComponent } from '../../Auth/forgot-password/forgot-password.component';

@Component({
  selector: 'app-admin-login',
  imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule, TwoFactorAuthComponent, ForgotPasswordComponent],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {

    loginForm: FormGroup;
    userId: number | null = null;
    show2FAPopup: boolean = false;
    showForgotPasswordModal: boolean = false;
  
  
    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
      });
    }
  
    onSubmit() {
      if (this.loginForm.valid) {
        this.authService.login(this.loginForm.value).subscribe(
          (response: any) => {
            this.userId = response.userId;
            if (this.userId !== null) {
              // localStorage.setItem('userId', this.userId.toString());
              this.show2FAPopup = true;
            } else {
              alert('Login failed: UserId not returned.');
            }
          },
          (error) => {
            alert('Login failed!');
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

}
