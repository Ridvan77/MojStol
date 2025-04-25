import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../Services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const token = localStorage.getItem('authToken'); 

    if (!token || this.tokenService.isTokenExpired(token)) {
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = this.tokenService.getUserRole(token);
    const allowedRoles = next.data['allowedRoles'] as string[];

    if (state.url.includes('/user-detail/')) {
      const requestedUserId = next.params['id'];
      console.log('REQUESTED USER ID FROM AUTH GUARD', requestedUserId);
      const currentUser = this.tokenService.getUser().sub;
      console.log('CURRENT USER FROM AUTH GUARD', currentUser);


      if(userRole !== 'Admin' && currentUser !== requestedUserId) {
        this.router.navigate(['/not-authorized']);
        console.log('NOT AUTHORIZED Test');
        return false;
      }

      console.log('Moze uci na stranicu');
      return true;
    }

    if (!allowedRoles) {
      console.log('Rola mu je dobra');
      return true;
    }

    if (userRole && allowedRoles.includes(userRole)) {
      console.log('Rola mu je dobra2');
      return true;
    } else {
      console.log('Rola mu ne valja');
      console.log("User not authorized for this route.");
      this.router.navigate(['/not-authorized']);
      return false;
    }
  }
}
