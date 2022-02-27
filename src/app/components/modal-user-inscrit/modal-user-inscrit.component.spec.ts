import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserInscritComponent } from './modal-user-inscrit.component';

describe('ModalUserInscritComponent', () => {
  let component: ModalUserInscritComponent;
  let fixture: ComponentFixture<ModalUserInscritComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalUserInscritComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUserInscritComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
