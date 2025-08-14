import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { ProfileService } from '../../../../common/services/profile.service';
import { Role } from '../../../../common/enums/roles';
import { AllRequestsComponent } from "./all-requests/all-requests.component";
import { UnquotedRequestsComponent } from "./unquoted-requests/unquoted-requests.component";
import { QuotedRequestsComponent } from "./quoted-requests/quoted-requests.component";
import { ExhaustedRequestsComponent } from "./exhausted-requests/exhausted-requests.component";
import { ExpiredRequestsComponent } from './expired-requests/expired-requests.component';
import { CommunicationService } from '../../../../common/services/communication.service';
import { GetUserInterface } from '../../../users-roles/users/interfaces/user.interface';

@Component({
  selector: 'app-requests-list',
  standalone: true,
  imports: [
    CommonModule,
    AllRequestsComponent,
    UnquotedRequestsComponent,
    QuotedRequestsComponent,
    ExhaustedRequestsComponent,
    ExpiredRequestsComponent
],
  templateUrl: './requests-list.component.html',
  styleUrl: './requests-list.component.css',
  providers: [DatePipe],
})
export class RequestsListComponent implements OnInit {
  activeItem!: number;
  userRegistered!: GetUserInterface;
  userRole!: Role;

  @Output() quote = new EventEmitter<string>();

  items = [
    {
      label: 'Todas las Solicitudes',
      role: [Role.ADMIN, Role.PROVIDER, Role.EMPLOYE],
    },
    {
      label: 'Solicitudes sin cotizar',
      role: [Role.PROVIDER, Role.EMPLOYE] // Admin para mas adelante,
    },
    {
      label: 'Solicitudes cotizadas',
      role: [Role.PROVIDER, Role.EMPLOYE] // Admin para mas adelante,
    },
    {
      label: 'Otras respuestas',
      role: [Role.PROVIDER, Role.EMPLOYE] // Admin para mas adelante,
    },
    {
      label: 'Solicitudes expiradas',
      role: [Role.ADMIN],
    }
  ];

  constructor(
    private profileService: ProfileService,
    private communicationService: CommunicationService,
  ) {}

  ngOnInit(): void {
    this.getAuthUser();
  }

  getAuthUser() {
    this.communicationService.loading.emit(true);
    this.profileService.getProfile().subscribe({
      next: (user) => {
        this.userRegistered = user;
        this.userRole = user.role as Role;
        if(this.userRole === Role.ADMIN){
          this.activeItem = 0;
        }else{
          this.activeItem = 1;
        }
      },
      error: (err) => {
        console.error('Error al obtener el usuario', err);
      },
    });
  }

  setActiveTab(index: number) {
    this.activeItem = index;
  }

  requestToQuoteActive(id: string){
    this.quote.emit(id);
  }

}
