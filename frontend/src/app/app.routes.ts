import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './Admin/admin-dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from './Admin/admin-layout/admin-layout.component';
import { AdminOwnersComponent } from './Admin/admin-owners/admin-owners.component';
import { AdminProfileComponent } from './Admin/admin-profile/admin-profile.component';
import { AdminReservationsComponent } from './Admin/admin-reservations/admin-reservations.component';
import { AdminRestaurantsComponent } from './Admin/admin-restaurants/admin-restaurants.component';
import { AdminSettingsComponent } from './Admin/admin-settings/admin-settings.component';
import { AdminUsersComponent } from './Admin/admin-users/admin-users.component';
import { AuthGuardService } from './Auth-guard/auth-guard.service';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { ResetPasswordComponent } from './Auth/reset-password/reset-password.component';
import { OwnerDashboardComponent } from './Owner/owner-dashboard/owner-dashboard.component';
import { OwnerLayoutComponent } from './Owner/owner-layout/owner-layout.component';
import { OwnerProfileComponent } from './Owner/owner-profile/owner-profile.component';
import { OwnerRestaurantsComponent } from './Owner/owner-restaurants/owner-restaurants.component';
import { AboutUsComponent } from './Public/about-us/about-us.component';
import { ContactUsComponent } from './Public/contact-us/contact-us.component';
import { FaqComponent } from './Public/faq/faq.component';
import { LandingComponent } from './Public/landing/landing.component';
import { NotAuthorizedComponent } from './Public/not-authorized/not-authorized.component';
import { NotFoundComponent } from './Public/not-found/not-found.component';
import { PrivacyPolicyComponent } from './Public/privacy-policy/privacy-policy.component';
import { PublicLayoutComponent } from './Public/public-layout/public-layout.component';
import { DetailsComponent } from './User/details/details.component';
import { RestaurantDetailsOwnerComponent } from './components/restaurant-details-owner/restaurant-details-owner.component';
import { RestaurantDetailsComponent } from './components/restaurant-details/restaurant-details.component';
import { RestaurantListComponent } from './components/restaurant-list/restaurant-list.component';
import { RestaurantQrScannerComponent } from './components/restaurant-qr-scanner/restaurant-qr-scanner.component';
import { ReservationPageComponent } from './reservation-page/reservation-page.component';
import { ReservationEditPageComponent } from './reservation-edit-page/reservation-edit-page.component';
import { ReviewPageComponent } from './review-page/review-page.component';
import { MyFavouritesComponent } from './my-favourites/my-favourites.component';
import { MyVisitAgainComponent } from './my-visit-again/my-visit-again.component';

import { OwnerReservationsComponent } from './Owner/owner-reservations/owner-reservations.component';
import { UserReservationsComponent } from './User/user-reservations/user-reservations.component';

export const routes: Routes = [
  // {
  //   path: '',
  //   canActivate: [AuthGuardService],
  //   component: LandingComponent,
  //   data: { checkOwner: true },
  // },
  { path: '', component: LandingComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'reservations',
    children: [
      {
        path: ':id',
        component: ReservationPageComponent,
        canActivate: [AuthGuardService],
        data: { allowedRoles: ['User'] },
      },
      {
        path: 'edit/:id',
        component: ReservationEditPageComponent,
        canActivate: [AuthGuardService],
        data: { allowedRoles: ['User', 'Owner', 'Admin'] },
      },
    ],
  },
  {
    path: 'reviews',
    children: [
      {
        path: ':id',
        component: ReviewPageComponent,
        canActivate: [AuthGuardService],
        data: { allowedRoles: ['User'] },
      },
    ],
  },
  {
    path: 'restaurants',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: RestaurantListComponent },
      // { path: ':id', component: RestaurantDetailsComponent },
      { path: ':id', component: RestaurantDetailsOwnerComponent },
    ],
  },

  // ============================================ Public specific routes =================================================================
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'about-us', component: AboutUsComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'contact-us', component: ContactUsComponent },
      { path: 'faq', component: FaqComponent },
    ],
  },
  // ============================================ User specific routes =================================================================
  {
    path: 'user',
    component: PublicLayoutComponent,
    children: [{ path: 'reservations', component: UserReservationsComponent }],
    canActivate: [AuthGuardService],
    data: { allowedRoles: ['User'] },
  },
  {
    path: 'my-favourites',
    component: MyFavouritesComponent,
    canActivate: [AuthGuardService],
    data: { allowedRoles: ['User'] },
  },
  {
    path: 'my-visit-agains',
    component: MyVisitAgainComponent,
    canActivate: [AuthGuardService],
    data: { allowedRoles: ['User'] },
  },

  // ============================================ Admin specific routes =================================================================
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'owners', component: AdminOwnersComponent },
      { path: 'restaurants', component: AdminRestaurantsComponent },
      { path: 'reservations', component: AdminReservationsComponent },
      { path: 'profile', component: AdminProfileComponent },
      { path: 'settings', component: AdminSettingsComponent },
    ],
    canActivate: [AuthGuardService],
    data: { allowedRoles: ['Admin'] },
  },

  // ============================================ Owner specific routes =================================================================
  {
    path: 'owner',
    component: OwnerLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: OwnerDashboardComponent },
      { path: 'restaurants', component: OwnerRestaurantsComponent },
      { path: 'reservations', component: OwnerReservationsComponent },
      { path: 'profile', component: OwnerProfileComponent },
      { path: 'qr-scanner', component: RestaurantQrScannerComponent },
    ],
    canActivate: [AuthGuardService],
    data: { allowedRoles: ['Owner'] },
  },

  // ============================================ Logged in User and Admin specific routes =================================================================
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: 'user-detail/:id',
        component: DetailsComponent,
        canActivate: [AuthGuardService],
        data: { allowedRoles: ['Admin', 'Owner', 'User'] },
      },
    ],
  },

  // ============================================ Owner and Admin specific routes =================================================================
  {
    path: 'edit',
    component: PublicLayoutComponent,
    children: [
      {
        path: 'restaurants/:id',
        component: RestaurantDetailsOwnerComponent,
        canActivate: [AuthGuardService],
        data: { allowedRoles: ['Admin', 'Owner'] },
      },
    ],
  },

  { path: 'not-found', component: NotFoundComponent },
  { path: 'not-authorized', component: NotAuthorizedComponent },

  { path: '**', redirectTo: '' },
];
