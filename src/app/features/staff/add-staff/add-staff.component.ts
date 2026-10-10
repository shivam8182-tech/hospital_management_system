import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
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
const idValidators = [Validators.required, Validators.pattern(/^[A-Za-z0-9-]{2,30}$/)];

@Component({
  selector: 'app-add-staff',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldErrorComponent
  ],
  templateUrl: './add-staff.component.html',
  styleUrl: './add-staff.component.css'
})
export class AddStaffComponent {
  private readonly entityService = inject(EntityService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  staffForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.staffForm = this.fb.group({
      firstName: ['', nameValidators],
      lastName: ['', nameValidators],
      dateOfBirth: ['', this.notFutureDate],
      gender: ['', Validators.required],

      phone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      staffId: ['', idValidators],
      role: ['', Validators.required],
      department: ['', Validators.required],
      joiningDate: ['', Validators.required],

      address: [''],
      city: [''],
      state: [''],
      zipCode: ['', Validators.pattern(/^\d{5}(?:-\d{4})?$/)]
    });
  }

  saveStaff() {
    if (this.staffForm.invalid) {
      this.staffForm.markAllAsTouched();
      this.toast.error('Please correct the highlighted fields before saving the staff member.');
      return;
    }

    const values = this.staffForm.getRawValue();
    const staffData = {
      ...values,
      id: `S${Date.now()}`,
      name: `${values.firstName.trim()} ${values.lastName.trim()}`,
      dob: values.dateOfBirth,
      status: 'Active' as const
    };

    try {
      this.entityService.addEntity('staff', staffData);
      console.log('Staff member added:', staffData);
      this.toast.success('Staff member added successfully.');
      this.staffForm.reset();
      void this.router.navigate(['/dashboard/staff']);
    } catch (error) {
      console.error('Failed to save staff member:', error);
      this.toast.error(this.errorMessage(error, 'Unable to save the staff member. Please try again.'));
    }
  }

  resetForm(): void {
    this.staffForm.reset();
  }

  private readonly notFutureDate = (control: AbstractControl) =>
    control.value && control.value > new Date().toISOString().slice(0, 10) ? { futureDate: true } : null;

  private errorMessage(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}