import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIncidentMissionComponent } from './modal-incident-mission.component';

describe('ModalIncidentMissionComponent', () => {
  let component: ModalIncidentMissionComponent;
  let fixture: ComponentFixture<ModalIncidentMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalIncidentMissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIncidentMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
