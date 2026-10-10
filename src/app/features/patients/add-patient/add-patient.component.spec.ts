import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPatientComponent } from './add-patient.component';
import { EntityService } from '../../../core/services/entity.service';
import { Router } from '@angular/router';

describe('AddPatientComponent', () => {
  let fixture: ComponentFixture<AddPatientComponent>;
  let component: AddPatientComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPatientComponent],
      providers: [
        EntityService,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('starts with one emergency contact', () => {
    expect(component.emergencyContacts.length).toBe(1);
  });

  it('adds and removes dynamic emergency contacts', () => {
    component.addEmergencyContact();
    expect(component.emergencyContacts.length).toBe(2);
    component.removeEmergencyContact(1);
    expect(component.emergencyContacts.length).toBe(1);
  });

  it('rejects an invalid patient name', () => {
    const firstName = component.patientForm.get('personalInfo.firstName');
    firstName?.setValue('123');
    expect(firstName?.invalid).toBeTrue();
  });

  it('does not advance while the current step is invalid', () => {
    component.nextStep();
    expect(component.currentStep).toBe(0);
    expect(component.patientForm.get('personalInfo.firstName')?.touched).toBeTrue();
  });
});