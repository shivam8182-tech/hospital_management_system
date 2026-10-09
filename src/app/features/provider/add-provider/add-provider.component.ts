import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-add-provider',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-provider.component.html',
  styleUrl: './add-provider.component.css'
})
export class AddProviderComponent {

  providerForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.providerForm = this.fb.group({

      // Doctor Information
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: [''],

      // Professional Information
      providerId: ['', Validators.required],
      specialization: ['', Validators.required],
      department: ['', Validators.required],
      qualification: ['', Validators.required],
      medicalLicenseNo: ['', Validators.required],
      experience: [''],
      joiningDate: ['', Validators.required],

      // Contact Information
      phone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      // Address
      address: [''],
      city: [''],
      state: [''],
      zipCode: ['']
    });
  }

  saveProvider(): void {

    if (this.providerForm.invalid) {
      this.providerForm.markAllAsTouched();
      return;
    }

    const providerData = {
      id: Date.now(),
      ...this.providerForm.value
    };

    console.log('Provider Data:', providerData);

    // Get existing providers
    const providers = JSON.parse(
      localStorage.getItem('providers') || '[]'
    );

    // Add new provider
    providers.push(providerData);

    // Save providers
    localStorage.setItem(
      'providers',
      JSON.stringify(providers)
    );

    alert('Provider added successfully!');

    this.providerForm.reset();
  }

  resetForm(): void {
    this.providerForm.reset();
  }
}