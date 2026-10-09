import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { EntityService } from '../services/entity.service';

/** Cross-field validator: compares two controls in the same FormGroup. */
export function fieldsMatch(first: string, second: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const a = control.get(first)?.value;
    const b = control.get(second)?.value;
    return a && b && a !== b ? { fieldsMismatch: true } : null;
  };
}

/** Regex validator for a US phone number stored as 10 digits. */
export const usPhoneRegex = /^(?:[2-9]\d{2})[2-9]\d{6}$/;

/** Async validator: checks whether a patient MRN already exists. */
export function uniqueMrnValidator(service: EntityService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = String(control.value ?? '').trim();
    if (!value) return of(null);
    return of(service.mrnExists(value)).pipe(
      delay(400),
      map(exists => exists ? { mrnTaken: true } : null)
    );
  };
}