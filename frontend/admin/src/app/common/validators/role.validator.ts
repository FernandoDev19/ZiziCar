import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Role } from '../enums/roles';

export function roleValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const allowedRoles = Object.values(Role);
    const isValid = allowedRoles.includes(control.value);
    return isValid ? null : { invalidRole: { value: control.value } };
  };
}
