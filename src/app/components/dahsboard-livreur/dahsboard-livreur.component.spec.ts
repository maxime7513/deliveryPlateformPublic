import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DahsboardLivreurComponent } from './dahsboard-livreur.component';

describe('DahsboardLivreurComponent', () => {
  let component: DahsboardLivreurComponent;
  let fixture: ComponentFixture<DahsboardLivreurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DahsboardLivreurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DahsboardLivreurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
