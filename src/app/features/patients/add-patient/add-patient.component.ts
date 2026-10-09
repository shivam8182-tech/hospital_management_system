import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.css'
})
export class AddPatientComponent {

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
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
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
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required]
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
      name: ['', Validators.required],
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
      providerName: ['', Validators.required],
      policyNumber: ['', Validators.required],
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

    if (this.currentStep < this.steps.length - 1) {

      this.currentStep++;
    }
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

      alert('Please complete all required fields.');

      return;
    }

    const patient = {
      id: Date.now(),
      ...this.patientForm.value
    };

    console.log('Patient Data:', patient);

    // Get existing patients
    const patients = JSON.parse(
      localStorage.getItem('patients') || '[]'
    );

    // Add patient
    patients.push(patient);

    // Save patients
    localStorage.setItem(
      'patients',
      JSON.stringify(patients)
    );

    alert('Patient added successfully!');

    // Reset form
    this.patientForm.reset();

    // Reset FormArrays
    this.addresses.clear();
    this.addresses.push(this.createAddress());

    this.emergencyContacts.clear();
    this.emergencyContacts.push(
      this.createEmergencyContact()
    );

    this.insurance.clear();
    this.insurance.push(this.createInsurance());

    // Go to first widget
    this.currentStep = 0;
  }
}