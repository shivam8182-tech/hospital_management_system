import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { EntityService } from '../../../core/services/entity.service';
import { ToastService } from '../../../core/services/toast.service';
import { FormFieldErrorComponent } from '../../../shared/components/form-field-error/form-field-error.component';

const nameValidators = [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z' -]*$/), Validators.maxLength(50)];
const idValidators = [Validators.required, Validators.pattern(/^[A-Za-z0-9-]{2,30}$/)];
const zipValidators = [Validators.pattern(/^\d{5}(?:-\d{4})?$/)];

@Component({
  selector: 'app-add-biller',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldErrorComponent
  ],
  templateUrl: './add-biller.component.html',
  styleUrl: './add-biller.component.css'
})
export class AddBillerComponent {
  private readonly entityService = inject(EntityService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  billerForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.billerForm = this.fb.group({

      // Biller Information
      firstName: ['', nameValidators],
      lastName: ['', nameValidators],
      gender: ['', Validators.required],
      dateOfBirth: ['', this.notFutureDate],

      // Professional Information
      billerId: ['', idValidators],
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
      zipCode: ['', zipValidators]
    });
  }

  saveBiller(): void {
    if (this.billerForm.invalid) {
      this.billerForm.markAllAsTouched();
      this.toast.error('Please correct the highlighted fields before saving the biller.');
      return;
    }

    const values = this.billerForm.getRawValue();
    const billerData = {
      ...values,
      id: `B${Date.now()}`,
      name: `${values.firstName.trim()} ${values.lastName.trim()}`,
      status: 'Active' as const
    };

    try {
      this.entityService.addEntity('biller', billerData);
      console.log('Biller added:', billerData);
      this.toast.success('Biller added successfully.');
      this.billerForm.reset();
      void this.router.navigate(['/dashboard/biller']);
    } catch (error) {
      console.error('Failed to save biller:', error);
      this.toast.error(this.errorMessage(error, 'Unable to save the biller. Please try again.'));
    }
  }

  resetForm(): void {
    this.billerForm.reset();
  }

  private readonly notFutureDate = (control: import('@angular/forms').AbstractControl) =>
    control.value && control.value > new Date().toISOString().slice(0, 10) ? { futureDate: true } : null;

  private errorMessage(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}