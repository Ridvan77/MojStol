import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOwnersComponent } from './admin-owners.component';

describe('AdminOwnersComponent', () => {
  let component: AdminOwnersComponent;
  let fixture: ComponentFixture<AdminOwnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOwnersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOwnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
