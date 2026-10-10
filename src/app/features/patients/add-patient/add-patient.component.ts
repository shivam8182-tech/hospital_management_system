import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { EntityService } from '../../../core/services/entity.service';
import { ToastService } from '../../../core/services/toast.service';
import { FormFieldErrorComponent } from '../../../shared/components/form-field-error/form-field-error.component';

const nameValidators = [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z' -]*$/), Validators.maxLength(50)];

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldErrorComponent
  ],
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.css'
})
export class AddPatientComponent {
  private readonly entityService = inject(EntityService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  currentStep = 0;

  patientForm: FormGroup;

  steps = [
    {
      title: 'Personal Information',
      description: 'Enter patient personal details'
    },
    {
      title: 'Contact Information',
      description: 'Enter patient contact details'
    },
    {
      title: 'Address',
      description: 'Enter patient address'
    },
    {
      title: 'Emergency Contact',
      description: 'Enter emergency contact details'
    },
    {
      title: 'Medical Information',
      description: 'Enter patient medical details'
    },
    {
      title: 'Insurance',
      description: 'Enter insurance information'
    }
  ];

  constructor(private fb: FormBuilder) {

    this.patientForm = this.fb.group({

      // =================================
      // 1. PERSONAL INFORMATION
      // =================================

      personalInfo: this.fb.group({
        firstName: ['', nameValidators],
        lastName: ['', nameValidators],
        dateOfBirth: ['', [Validators.required, this.notFutureDate]],
        gender: ['', Validators.required],
        maritalStatus: ['']
      }),

      // =================================
      // 2. CONTACT INFORMATION
      // =================================

      contactInfo: this.fb.group({
          phone: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[0-9]{10}$/)
          ]
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ]
      }),

      // =================================
      // 3. ADDRESSES - FORM ARRAY
      // =================================

      addresses: this.fb.array([
        this.createAddress()
      ]),

      // =================================
      // 4. EMERGENCY CONTACTS - FORM ARRAY
      // =================================

      emergencyContacts: this.fb.array([
        this.createEmergencyContact()
      ]),

      // =================================
      // 5. MEDICAL INFORMATION
      // =================================

      medicalInfo: this.fb.group({
        bloodGroup: [''],
        allergies: [''],
        medicalConditions: [''],
        currentMedications: [''],
        previousSurgeries: ['']
      }),

      // =================================
      // 6. INSURANCE - FORM ARRAY
      // =================================

      insurance: this.fb.array([
        this.createInsurance()
      ])
    });
  }


  // =================================
  // FORM ARRAY GETTERS
  // =================================

  get addresses(): FormArray {
    return this.patientForm.get('addresses') as FormArray;
  }

  get emergencyContacts(): FormArray {
    return this.patientForm.get('emergencyContacts') as FormArray;
  }

  get insurance(): FormArray {
    return this.patientForm.get('insurance') as FormArray;
  }


  // =================================
  // ADDRESS FORM
  // =================================

  createAddress(): FormGroup {

    return this.fb.group({
      addressType: ['Home', Validators.required],
      address: ['', [Validators.required, Validators.pattern(/\S/)]],
      city: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(60)]],
      state: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(60)]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(?:-\d{4})?$/)]]
    });
  }

  addAddress(): void {
    this.addresses.push(this.createAddress());
  }

  removeAddress(index: number): void {

    if (this.addresses.length > 1) {
      this.addresses.removeAt(index);
    }
  }


  // =================================
  // EMERGENCY CONTACT FORM
  // =================================

  createEmergencyContact(): FormGroup {

    return this.fb.group({
      name: ['', nameValidators],
      relationship: ['', Validators.required],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ]
    });
  }

  addEmergencyContact(): void {
    this.emergencyContacts.push(
      this.createEmergencyContact()
    );
  }

  removeEmergencyContact(index: number): void {

    if (this.emergencyContacts.length > 1) {
      this.emergencyContacts.removeAt(index);
    }
  }


  // =================================
  // INSURANCE FORM
  // =================================

  createInsurance(): FormGroup {

    return this.fb.group({
      providerName: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(80)]],
      policyNumber: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9-]{3,30}$/)]],
      memberId: [''],
      groupNumber: [''],
      insuranceType: ['Primary']
    });
  }

  addInsurance(): void {
    this.insurance.push(
      this.createInsurance()
    );
  }

  removeInsurance(index: number): void {

    if (this.insurance.length > 1) {
      this.insurance.removeAt(index);
    }
  }


  // =================================
  // NEXT STEP
  // =================================

  nextStep(): void {
    if (this.currentStep >= this.steps.length - 1) return;
    const group = this.stepControl(this.currentStep);
    if (group.invalid) {
      group.markAllAsTouched();
      this.toast.error('Please complete the highlighted required fields before continuing.');
      return;
    }
    this.currentStep++;
  }


  // =================================
  // PREVIOUS STEP
  // =================================

  previousStep(): void {

    if (this.currentStep > 0) {

      this.currentStep--;
    }
  }


  // =================================
  // GO TO STEP
  // =================================

  goToStep(index: number): void {

    if (index <= this.currentStep) {

      this.currentStep = index;
    }
  }


  // =================================
  // SAVE PATIENT
  // =================================

  savePatient(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      const firstInvalidStep = this.steps.findIndex((_, index) => this.stepControl(index).invalid);
      this.currentStep = firstInvalidStep < 0 ? 0 : firstInvalidStep;
      this.toast.error('Please correct the highlighted fields before saving the patient.');
      return;
    }

    const values = this.patientForm.getRawValue();
    const id = `P${Date.now()}`;
    const patient = {
      ...values.personalInfo,
      ...values.contactInfo,
      ...values.medicalInfo,
      id,
      name: `${values.personalInfo.firstName.trim()} ${values.personalInfo.lastName.trim()}`,
      email: values.contactInfo.email.trim(),
      phone: values.contactInfo.phone,
      dob: values.personalInfo.dateOfBirth,
      mrn: id,
      address: values.addresses[0]?.address ?? '',
      status: 'Active' as const,
      addresses: values.addresses,
      emergencyContacts: values.emergencyContacts,
      insurancePolicies: values.insurance
    };

    try {
      this.entityService.addEntity('patient', patient);
      console.log('Patient added:', patient);
      this.toast.success('Patient added successfully.');
      this.resetForm();
      void this.router.navigate(['/dashboard/patient']);
    } catch (error) {
      console.error('Failed to save patient:', error);
      this.toast.error(this.errorMessage(error, 'Unable to save the patient. Please try again.'));
    }
  }

  resetForm(): void {
    this.patientForm.reset();
    this.addresses.clear();
    this.addresses.push(this.createAddress());
    this.emergencyContacts.clear();
    this.emergencyContacts.push(this.createEmergencyContact());
    this.insurance.clear();
    this.insurance.push(this.createInsurance());
    this.currentStep = 0;
  }

  private stepControl(index: number): AbstractControl {
    const paths = ['personalInfo', 'contactInfo', 'addresses', 'emergencyContacts', 'medicalInfo', 'insurance'];
    return this.patientForm.get(paths[index])!;
  }

  private readonly notFutureDate = (control: AbstractControl) =>
    control.value && control.value > new Date().toISOString().slice(0, 10) ? { futureDate: true } : null;

  private errorMessage(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}