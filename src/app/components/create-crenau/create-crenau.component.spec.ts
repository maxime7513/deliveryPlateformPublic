import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCrenauComponent } from './create-crenau.component';

describe('CreateCrenauComponent', () => {
  let component: CreateCrenauComponent;
  let fixture: ComponentFixture<CreateCrenauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCrenauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCrenauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
