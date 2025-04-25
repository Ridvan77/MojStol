import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantQrScannerComponent } from './restaurant-qr-scanner.component';

describe('RestaurantQrScannerComponent', () => {
  let component: RestaurantQrScannerComponent;
  let fixture: ComponentFixture<RestaurantQrScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantQrScannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantQrScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
