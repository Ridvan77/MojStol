import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { AdminDashboardComponent } from './Admin/admin-dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from './Admin/admin-layout/admin-layout.component';
import { AuthGuardService } from './Auth-guard/auth-guard.service';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { ResetPasswordComponent } from './Auth/reset-password/reset-password.component';
import { LandingComponent } from './Public/landing/landing.component';
import { ReservationPageComponent } from './reservation-page/reservation-page.component';
import { ReviewPageComponent } from './review-page/review-page.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'reservations',
    component: ReservationPageComponent,
    canActivate: [AuthGuardService],
    data: { role: 'User' },
  },
  { path: 'reviews', component: ReviewPageComponent },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [{ path: 'dashboard', component: AdminDashboardComponent }],
    canActivate: [AuthGuardService],
    data: { role: 'Admin' },
  },

  { path: '**', redirectTo: '' },
];

export const appConfig = {
  providers: [provideRouter(routes), provideHttpClient(withFetch())],
};
