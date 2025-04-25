import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationEditPageComponent } from './reservation-edit-page.component';

describe('ReservationEditPageComponent', () => {
  let component: ReservationEditPageComponent;
  let fixture: ComponentFixture<ReservationEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
