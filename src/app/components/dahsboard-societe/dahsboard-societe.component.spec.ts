import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DahsboardSocieteComponent } from './dahsboard-societe.component';

describe('DahsboardSocieteComponent', () => {
  let component: DahsboardSocieteComponent;
  let fixture: ComponentFixture<DahsboardSocieteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DahsboardSocieteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DahsboardSocieteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
