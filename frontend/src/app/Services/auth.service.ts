import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private baseUrl = 'http://localhost:5137/api/Auth';

  constructor(private http: HttpClient) {}

    register(userData: any): Observable<any> {
      return this.http.post(`${this.baseUrl}/register`, userData, { responseType: 'text' });
    }

    login(credentials: any): Observable<any> {
      return this.http.post(`${this.baseUrl}/login`, credentials);
    }
  
    verify2FA(data: { userId: number; twoFactorCode: string }): Observable<any> {
      return this.http.post(`${this.baseUrl}/verify-2fa`, data);
    }

  resend2FACode(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/resend-2fa`, { email });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, { token, newPassword });
  }
  
}
