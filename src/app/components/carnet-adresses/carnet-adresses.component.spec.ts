import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarnetAdressesComponent } from './carnet-adresses.component';

describe('CarnetAdressesComponent', () => {
  let component: CarnetAdressesComponent;
  let fixture: ComponentFixture<CarnetAdressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarnetAdressesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarnetAdressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
