import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-add-biller',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-biller.component.html',
  styleUrl: './add-biller.component.css'
})
export class AddBillerComponent {

  billerForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.billerForm = this.fb.group({

      // Biller Information
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: [''],

      // Professional Information
      billerId: ['', Validators.required],
      role: ['', Validators.required],
      department: ['', Validators.required],
      employeeType: ['', Validators.required],
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

  saveBiller(): void {

    if (this.billerForm.invalid) {
      this.billerForm.markAllAsTouched();
      return;
    }

    const billerData = {
      id: Date.now(),
      ...this.billerForm.value
    };

    console.log('Biller Data:', billerData);

    // Get existing billers
    const billers = JSON.parse(
      localStorage.getItem('billers') || '[]'
    );

    // Add new biller
    billers.push(billerData);
    console.log(billers)

    // Save billers
    localStorage.setItem(
      'billers',
      JSON.stringify(billers)
    );

    console.log('Biller added successfully!');
    alert('Biller added successfully!');

    this.billerForm.reset();
  }

  resetForm(): void {
    this.billerForm.reset();
  }
}