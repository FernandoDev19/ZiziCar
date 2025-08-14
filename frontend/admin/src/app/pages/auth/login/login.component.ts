import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../../components/footer/footer.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AuthHeaderComponent } from '../../../components/auth/auth-header/auth-header.component';
import { LoginService } from './services/login.service';
import { CommunicationService } from '../../../common/services/communication.service';
import { LoginInterface } from './interfaces/login.interface';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEye,
  faEyeSlash,
  faKey,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { DataCommonService } from '../../../common/services/data-common.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    ReactiveFormsModule,
    FooterComponent,
    RouterLink,
    FloatLabelModule,
    AuthHeaderComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, AfterViewInit {
  //Iconos
  faUser: IconDefinition = faUser;
  faKey: IconDefinition = faKey;

  loginForm: FormGroup;
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
  iconEye: IconDefinition = faEye;
  isShowingPassword: boolean = false;
  spanButtonTitle: string = 'Mostrar contraseña';

  messageError: string = '';

  constructor(
    private fb: FormBuilder,
    @Inject(DOCUMENT) private document: Document,
    private loginService: LoginService,
    private communicationService: CommunicationService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngAfterViewInit(): void {
    const body = this.document.body;
    body.style.overflow = '';
    body.style.paddingRight = '';
    body.removeAttribute('data-bs-overflow');
    body.removeAttribute('data-bs-padding-right');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.communicationService.loading.emit(true);

      const loginData: LoginInterface = {
        ...this.loginForm.value,
      };

      this.loginService.login(loginData).subscribe({
        next: (token) => {
          this.loginService.saveToken(token);
        },
        error: (error) => {
          console.error('Error al iniciar sesión:', error.error.message);
          if(error.status === 401){
            this.messageError = "Email o Contraseña son incorrectas.";
          }
        },
        complete: () => {
          this.redirectToAdmin();
        },
      });
    } else {
      console.log('Formulario invalido');
    }
  }

  redirectToAdmin() {
    this.router.navigate(['/home']);
  }

  showPassword(): void {
    const password = this.passwordInput.nativeElement;
    if (password) {
      if (this.isShowingPassword) {
        this.isShowingPassword = false;

        this.iconEye = faEye;

        this.spanButtonTitle = 'Mostrar contraseña';

        password.setAttribute('type', 'password');
      } else {
        this.isShowingPassword = true;

        this.iconEye = faEyeSlash;

        this.spanButtonTitle = 'Ocultar contraseña';

        password.setAttribute('type', 'text');
      }
    }
  }
}
