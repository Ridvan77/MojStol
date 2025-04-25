import { TestBed } from '@angular/core/testing';

import { RestaurantTagService } from './restaurant-tag.service';

describe('RestaurantTagService', () => {
  let service: RestaurantTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
