import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <small class="field-error" role="alert" *ngIf="control && control.invalid && (control.touched || control.dirty)">
      {{ message }}
    </small>
  `,
  styles: [`
    .field-error { display: block; margin-top: 5px; color: #b42318; font-size: 12px; line-height: 1.4; }
  `]
})
export class FormFieldErrorComponent {
  @Input() control: AbstractControl | null = null;
  @Input() label = 'This field';

  get message(): string {
    const errors = this.control?.errors;
    if (!errors) return '';
    if (errors['required']) return `${this.label} is required.`;
    if (errors['email']) return 'Enter a valid email address.';
    if (errors['pattern']) {
      if (this.label.toLowerCase().includes('phone')) return 'Enter a valid 10-digit phone number.';
      if (this.label.toLowerCase().includes('zip')) return 'Enter a valid ZIP code.';
      if (this.label.toLowerCase().includes('name')) return 'Use letters, spaces, apostrophes, or hyphens only.';
      return `Enter a valid ${this.label.toLowerCase()}.`;
    }
    if (errors['min']) return `${this.label} must be at least ${errors['min'].min}.`;
    if (errors['max']) return `${this.label} cannot exceed ${errors['max'].max}.`;
    if (errors['minlength']) return `${this.label} must be at least ${errors['minlength'].requiredLength} characters.`;
    if (errors['maxlength']) return `${this.label} cannot exceed ${errors['maxlength'].requiredLength} characters.`;
    if (errors['futureDate']) return `${this.label} cannot be in the future.`;
    return `${this.label} is invalid.`;
  }
}
