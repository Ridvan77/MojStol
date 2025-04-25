import { TestBed } from '@angular/core/testing';

import { RestaurantPaymentMethodService } from './restaurant-payment-method.service';

describe('RestaurantPaymentMethodService', () => {
  let service: RestaurantPaymentMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantPaymentMethodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
