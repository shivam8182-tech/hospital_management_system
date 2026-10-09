import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-add-staff',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-staff.component.html',
  styleUrl: './add-staff.component.css'
})
export class AddStaffComponent {

  staffForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.staffForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: [''],
      gender: ['', Validators.required],

      phone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      staffId: ['', Validators.required],
      role: ['', Validators.required],
      department: ['', Validators.required],
      joiningDate: ['', Validators.required],

      address: [''],
      city: [''],
      state: [''],
      zipCode: ['']
    });
  }

  saveStaff() {

    if (this.staffForm.invalid) {
      this.staffForm.markAllAsTouched();
      return;
    }

    const staffData = {
      id: Date.now(),
      ...this.staffForm.value
    };

    console.log('Staff Data:', staffData);

    const staffList = JSON.parse(
      localStorage.getItem('staffList') || '[]'
    );

    staffList.push(staffData);

    localStorage.setItem(
      'staffList',
      JSON.stringify(staffList)
    );

    alert('Staff added successfully!');

    this.staffForm.reset();
  }
}