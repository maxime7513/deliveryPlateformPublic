import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningKYOComponent } from './planning-kyo.component';

describe('PlanningKYOComponent', () => {
  let component: PlanningKYOComponent;
  let fixture: ComponentFixture<PlanningKYOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningKYOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningKYOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
