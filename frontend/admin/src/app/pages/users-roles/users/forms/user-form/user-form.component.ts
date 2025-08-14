import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faShieldAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { UserDataCommunicationService } from '../../services/user-data-communication.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { roleValidator } from '../../../../../common/validators/role.validator';
import { Role } from '../../../../../common/enums/roles';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  userForm!: FormGroup;
  //Iconos
  faUser: IconDefinition = faUser;
  faGuard: IconDefinition = faShieldAlt;

  constructor(private userDataCommunication: UserDataCommunicationService, private fb: FormBuilder){
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$')]],
      role: ['', [Validators.required, roleValidator()]]
    });
  }

  changeRole(event: Event){
    const value = (<HTMLSelectElement>event.target).value;

    if(value === Role.PROVIDER){
      this.userDataCommunication.isRoleProvider.emit(true);
    }else if(value === Role.EMPLOYE) {
      this.userDataCommunication.isRoleProvider.emit(false);
    }else if(value === Role.ADMIN){
      this.userDataCommunication.isRoleProvider.emit(false);
    }else if (value === Role.USER){
      this.userDataCommunication.isRoleProvider.emit(false);
    }
  }
}
