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
const zipValidators = [Validators.pattern(/^\d{5}(?:-\d{4})?$/)];

@Component({
  selector: 'app-add-provider',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldErrorComponent
  ],
  templateUrl: './add-provider.component.html',
  styleUrl: './add-provider.component.css'
})
export class AddProviderComponent {
  private readonly entityService = inject(EntityService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  providerForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.providerForm = this.fb.group({

      // Doctor Information
      firstName: ['', nameValidators],
      lastName: ['', nameValidators],
      gender: ['', Validators.required],
      dateOfBirth: ['', this.notFutureDate],

      // Professional Information
      providerId: ['', idValidators],
      specialization: ['', Validators.required],
      department: ['', Validators.required],
      qualification: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      medicalLicenseNo: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9/-]{3,30}$/)]],
      experience: ['', [Validators.min(0), Validators.max(70), Validators.pattern(/^\d+(?:\.\d{1,2})?$/)]],
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

  saveProvider(): void {
    if (this.providerForm.invalid) {
      this.providerForm.markAllAsTouched();
      this.toast.error('Please correct the highlighted fields before saving the provider.');
      return;
    }

    const values = this.providerForm.getRawValue();
    const providerData = {
      ...values,
      id: `PR${Date.now()}`,
      name: `${values.firstName.trim()} ${values.lastName.trim()}`,
      specialty: values.specialization,
      dob: values.dateOfBirth,
      status: 'Active' as const
    };

    try {
      this.entityService.addEntity('provider', providerData);
      console.log('Provider added:', providerData);
      this.toast.success('Provider added successfully.');
      this.providerForm.reset();
      void this.router.navigate(['/dashboard/provider']);
    } catch (error) {
      console.error('Failed to save provider:', error);
      this.toast.error(this.errorMessage(error, 'Unable to save the provider. Please try again.'));
    }
  }

  resetForm(): void {
    this.providerForm.reset();
  }

  private readonly notFutureDate = (control: AbstractControl) =>
    control.value && control.value > new Date().toISOString().slice(0, 10) ? { futureDate: true } : null;

  private errorMessage(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}