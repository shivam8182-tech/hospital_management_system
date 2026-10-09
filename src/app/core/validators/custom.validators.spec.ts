import { FormControl, FormGroup } from '@angular/forms';
import { fieldsMatch } from './custom.validators';

describe('fieldsMatch', () => {
  it('returns null when fields match', () => {
    const group = new FormGroup({
      password: new FormControl('secret'),
      confirmPassword: new FormControl('secret')
    });
    expect(fieldsMatch('password', 'confirmPassword')(group)).toBeNull();
  });

  it('returns an error when fields do not match', () => {
    const group = new FormGroup({
      password: new FormControl('secret'),
      confirmPassword: new FormControl('wrong')
    });
    expect(fieldsMatch('password', 'confirmPassword')(group)).toEqual({ fieldsMismatch: true });
  });
});