import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { TokenService } from '../../Services/token.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-restaurant-qr-scanner',
  standalone: true,
  imports: [ZXingScannerModule, NgIf],
  templateUrl: './restaurant-qr-scanner.component.html',
  styleUrls: ['./restaurant-qr-scanner.component.css'],
})
export class RestaurantQrScannerComponent {
  tokenService = inject(TokenService);

  request = {
    reservationId: 0,
    ownerId: 0,
  };
  errorMessage: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');

      if (token && !this.tokenService.isTokenExpired(token)) {
        const decodedToken = this.tokenService.decodeToken(token);

        this.request.ownerId = parseInt(decodedToken.sub);
      }
    }
  }

  onScanSuccess(scannedValue: string) {
    this.request.reservationId = parseInt(scannedValue);
    this.updateReservationStatus(this.request);
  }

  updateReservationStatus(request: any) {
    this.http
      .put('http://localhost:5137/api/Reservations/scanQrCode', request)
      .subscribe({
        next: (response) =>
          console.log('Reservation updated successfully', response),
        error: (error) => {
          if (error.statusText !== 'OK')
            this.errorMessage = 'Failed to update reservation';
          console.error('Error updating reservation:', error);
        },
      });
  }
}
