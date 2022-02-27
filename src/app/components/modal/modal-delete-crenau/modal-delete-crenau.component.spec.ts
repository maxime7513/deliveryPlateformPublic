import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteCrenauComponent } from './modal-delete-crenau.component';

describe('ModalDeleteCrenauComponent', () => {
  let component: ModalDeleteCrenauComponent;
  let fixture: ComponentFixture<ModalDeleteCrenauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDeleteCrenauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeleteCrenauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
