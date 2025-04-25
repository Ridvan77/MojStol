import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
    signOut() {
      localStorage.removeItem('authToken');
      console.log('User signed out');
    }
  
  constructor() {}

  // Decode the JWT Token
  decodeToken(token: string | null): any {
    if (!token) {
      return null;
    }
    
    // Split the token by dots and decode the payload (the second part)
    const payload = token.split('.')[1];
    
    // Decode from Base64
    const decodedPayload = atob(payload);

    console.log('User: ' ,JSON.parse(decodedPayload))
    
    // Parse JSON
    return JSON.parse(decodedPayload);
  }

  // Check if the token is expired
  isTokenExpired(token: string): boolean {
    const decodedToken = this.decodeToken(token);

    console.log(decodedToken, 'FROM isTokenExpired')

    if (!decodedToken || !decodedToken.exp) {
      return true; // If there's no expiration field, treat the token as expired
    }

    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decodedToken.exp);

    return expirationDate < new Date(); // Compare the expiration time with the current time
  }

  // Get the expiration date from the token
  getTokenExpirationDate(token: string): Date | null {
    const decodedToken = this.decodeToken(token);

    if (!decodedToken || !decodedToken.exp) {
      return null;
    }

    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decodedToken.exp);
    return expirationDate;
  }


  getUser(): any{
    return this.decodeToken(localStorage.getItem('authToken'));
  }


  getUserRole(token: string): string {
    const decodedToken = this.decodeToken(token);
    // Access the role from the standard claim URL
    const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return role || 'Unauthorised';  // Default to 'Unauthorised' if role not found
  }
  

  // Check if the user has a specific role
  hasRole(token: string, role: string): boolean {
    const userRole = this.getUserRole(token);
    return userRole === role;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  
}
