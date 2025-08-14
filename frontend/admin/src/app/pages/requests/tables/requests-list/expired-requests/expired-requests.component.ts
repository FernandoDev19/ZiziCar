import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommunicationService } from '../../../../../common/services/communication.service';
import { Role } from '../../../../../common/enums/roles';
import { RequestDataService } from '../../../services/request-data.service';
import { ConfirmationService } from 'primeng/api';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCaretDown,
  faCheck,
  faFaceFrownOpen,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { QuotesDataComponent } from '../modals/quotes-data/quotes-data.component';
import { CustomerDataComponent } from '../modals/customer-data/customer-data.component';
import { ProviderDataComponent } from '../modals/provider-data/provider-data.component';
import { AnswerDataComponent } from '../modals/answer-data/answer-data.component';
import { DataTableForRequestAdminInterface } from '../../../interfaces/data-table-for-requests.interface';
import { GetUserInterface } from '../../../../users-roles/users/interfaces/user.interface';
import { ExpiredRequestsPcVersionComponent } from "./expired-requests-pc-version/expired-requests-pc-version.component";
import { ExpiredRequestsMobileVersionComponent } from "./expired-requests-mobile-version/expired-requests-mobile-version.component";

@Component({
  selector: 'app-expired-requests',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    OverlayPanelModule,
    ButtonModule,
    FontAwesomeModule,
    ConfirmDialogModule,
    CustomerDataComponent,
    QuotesDataComponent,
    ProviderDataComponent,
    AnswerDataComponent,
    ExpiredRequestsPcVersionComponent,
    ExpiredRequestsMobileVersionComponent
],
  templateUrl: './expired-requests.component.html',
  styleUrl: './expired-requests.component.css',
  providers: [DatePipe],
})
export class ExpiredRequestsComponent implements OnInit {
  requestsAdmin!: DataTableForRequestAdminInterface[];

  requestIdSelected!: string;
  phoneClient!: string;
    isMobile: boolean = false;

  @Input() userRegistered!: GetUserInterface;
  renterId: string = '';
  userRole!: Role;
  Role = Role;

  @Output() quote = new EventEmitter<string>();

  //Overlays
  @ViewChild('actions') actions!: OverlayPanel;

  // Iconos
  faCaretDown: IconDefinition = faCaretDown;
  faPaperPlane: IconDefinition = faPaperPlane;
  faCheck: IconDefinition = faCheck;
  faFrown: IconDefinition = faFaceFrownOpen;

  isCustomerDataLoaded: boolean = false;
  isQuotesDataLoaded: boolean = false;
  isAnswersDataLoaded: boolean = false;
  isSentToDataLoaded: boolean = false;

  splitButtonItems = [
    {
      label: 'Eliminar',
      type: 'delete',
      hover_bg_color: 'hover:bg-red-300',
      role: [Role.ADMIN],
    },
  ];

  constructor(
    private globalCommunication: CommunicationService,
    private requestService: RequestDataService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAuthUser();
this.checkScreen();
  }

  getAuthUser() {
    this.userRole = this.userRegistered.role as Role;
    this.renterId = this.userRegistered.provider_id || '';
    this.getRequests();
  }

  async getRequests() {
    this.globalCommunication.loading.emit(true);
    this.requestService.getRequests().subscribe({
      next: async (requests) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);

        this.requestsAdmin = requests
        .filter((request) => {
          const requestDate = new Date(request.entry_date_unformatted);
          return requestDate < currentDate;
        })
        .sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB.getTime() - dateA.getTime();
        });

        this.globalCommunication.loading.emit(false);
      },
      error: (err) => {
        console.error('Error fetching requests:', err);
        this.globalCommunication.loading.emit(false);
      },
    });
  }

  showOverlay(event: Event, type: string, requestIdSelected: string) {
    this.requestIdSelected = requestIdSelected;
    if (type === 'splitbutton') {
      this.actions.toggle(event);
    }
  }

  onSearch(event: Event, dtRequests: any): void {
    const input = event.target as HTMLInputElement;
    const value = input?.value || '';
    dtRequests.filterGlobal(value, 'contains');
  }

  get globalFields() {
    const fieldsForAdmin = [
      'name',
      'phone',
      'gamma',
      'transmission',
      'entry_city',
      'entry_date',
      'comments',
      'devolution_city',
      'devolution_date',
    ];
    const fieldsForProvider = [
      'gamma',
      'entry_city',
      'transmission',
      'entry_date',
      'comments',
      'devolution_city',
      'devolution_date',
    ];
    return this.userRole === Role.ADMIN ? fieldsForAdmin : fieldsForProvider;
  }

  @HostListener('window:resize', ['$event'])
  checkScreen() {
    const width = window.innerWidth;
    this.isMobile = width <= 768;
  }

  toggleModal(type: string) {
    if (type === 'customer') {
      this.isCustomerDataLoaded = !this.isCustomerDataLoaded;
    } else if (type === 'quote') {
      this.isQuotesDataLoaded = !this.isQuotesDataLoaded;
    } else if (type === 'sentTo') {
      this.isSentToDataLoaded = !this.isSentToDataLoaded;
    } else if (type === 'answer') {
      this.isAnswersDataLoaded = !this.isAnswersDataLoaded;
    }
  }

  async doAction(type: string, id: string = '', phoneClient: string = '') {
    const validTypes = [
      'delete',
      'view_quotes',
      'view_answers',
      'viewCustomer',
      'sent_to',
    ];
    if (!validTypes.includes(type)) {
      console.error('No se ha seleccionado una opcion correcta');
      return;
    }

    switch (type) {
      case 'delete':
        if(id){
          this.confirmAction(id);
        }else{
          this.confirmAction(this.requestIdSelected);
        }
        break;
      case 'view_quotes':
        this.requestIdSelected = id;
        if (this.requestIdSelected) {
          this.isQuotesDataLoaded = true;
        }
        break;
      case 'view_answers':
        this.requestIdSelected = id;
        if (this.requestIdSelected) {
          this.isAnswersDataLoaded = true;
        }
        break;
      case 'viewCustomer':
        this.phoneClient = phoneClient;
        if (this.phoneClient) {
          this.isCustomerDataLoaded = true;
        }
        break;
      case 'sent_to':
        this.requestIdSelected = id;
        if (this.requestIdSelected) {
          this.isSentToDataLoaded = true;
        }
        break;
      default:
        console.error('No se ha seleccionado una opcion correcta');
    }
  }

  confirmAction(requestId: string) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar esta solicitud?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRequest(requestId);
      },
      reject: () => {},
    });
  }

  deleteRequest(id: string) {
    this.globalCommunication.loading.emit(true);
    this.requestService.deleteRequest(id).subscribe({
      next: (request) => {
        console.log('Request deleted:', request);
        this.getRequests();
      },
      error: (error) => {
        console.error('Ha ocurrido un error al eliminar:', error);
        this.globalCommunication.loading.emit(false);
      },
      complete: () => {
        this.globalCommunication.loading.emit(false);
      },
    });
  }

  showProviderData(show: boolean) {
    this.isSentToDataLoaded = show;
  }

  showQuotesData(show: boolean) {
    this.isQuotesDataLoaded = show;
  }

  showAnswersData(show: boolean) {
    this.isAnswersDataLoaded = show;
  }

  showCustomerData(show: boolean) {
    this.isCustomerDataLoaded = show;
  }

  showActions(show: boolean) {
    if (show) {
      this.actions.show(show);
    } else {
      this.actions.hide();
    }
  }
}
