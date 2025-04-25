import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyVisitAgainComponent } from './my-visit-again.component';

describe('MyVisitAgainComponent', () => {
  let component: MyVisitAgainComponent;
  let fixture: ComponentFixture<MyVisitAgainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyVisitAgainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyVisitAgainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
