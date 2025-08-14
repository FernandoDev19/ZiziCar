import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FooterComponent } from '../../../components/footer/footer.component';
import { AuthHeaderComponent } from "../../../components/auth/auth-header/auth-header.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FooterComponent, AuthHeaderComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
  @ViewChild('confirmPassword') confirmPassword!: ElementRef<HTMLInputElement>;
  iconEye1: string = 'fas fa-eye';
  iconEye2: string = 'fas fa-eye';
  isShowingPassword: boolean = false;
  isShowingConfirmPassword: boolean = false;
  spanButtonTitle: string = 'Mostrar contraseña';
  spanButtonTitle2: string = 'Mostrar contraseña';
  isCPasswordEqualToPassword: boolean = false;

  constructor(private fb: FormBuilder){
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      nit: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern('^[0-9]{8,15}(-[0-9]{1,2})?$')]],
      phone: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(11), Validators.pattern('^[0-9]{8,11}$')]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$')]]
    });
  }

  ngOnInit(): void {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  showPassword(n: number): void{
    if(n === 1){
      const password = this.passwordInput.nativeElement;
      if(password){
        if(this.isShowingPassword){
          this.isShowingPassword = false;

          this.iconEye1 = 'fas fa-eye';

          this.spanButtonTitle = 'Mostrar contraseña';

          password.setAttribute('type', 'password');
        }else{
          this.isShowingPassword = true;

          this.iconEye1 = 'fas fa-eye-slash';

          this.spanButtonTitle = 'Ocultar contraseña';

          password.setAttribute('type', 'text');
        }
      }
    }else{
      const password = this.confirmPassword.nativeElement;
      if(this.isShowingConfirmPassword){
        this.isShowingConfirmPassword = false;

        this.iconEye2 = 'fas fa-eye';

        this.spanButtonTitle2 = 'Mostrar contraseña';

        password.setAttribute('type', 'password');
      }else{
        this.isShowingConfirmPassword = true;

        this.iconEye2 = 'fas fa-eye-slash';

        this.spanButtonTitle2 = 'Ocultar contraseña';

        password.setAttribute('type', 'text');
      }
    }
  }

  comparePassword(event: Event){
    const inputValue = (event.target as HTMLInputElement).value;
    if(inputValue === this.registerForm.get('password')?.value){
      this.isCPasswordEqualToPassword = true;
    }else{
      this.isCPasswordEqualToPassword = false;
    }
  }

}
