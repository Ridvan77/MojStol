import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// No whitespace validator function
export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isOnlyWhitespace = control.value?.trim().length === 0;
    return isOnlyWhitespace ? { whitespace: true } : null;
  };
}

export function customEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(control.value) ? null : { invalidEmail: true };
  };
}
