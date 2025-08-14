import { CommonModule } from '@angular/common';
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
import { PostAnswerInterface } from '../../../../../common/interfaces/common.interface';
import { RequestDataService } from '../../../services/request-data.service';
import { firstValueFrom } from 'rxjs';
import { AnswerService } from '../../../../../common/services/answer.service';
import { ConfirmationService } from 'primeng/api';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCaretDown,
  faCheck,
  faFaceFrown,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { QuotesDataComponent } from '../modals/quotes-data/quotes-data.component';
import { CustomerDataComponent } from '../modals/customer-data/customer-data.component';
import { ProviderDataComponent } from '../modals/provider-data/provider-data.component';
import { AnswerDataComponent } from '../modals/answer-data/answer-data.component';
import { GetUserInterface } from '../../../../users-roles/users/interfaces/user.interface';
import {
  DataTableForRequestAdminInterface,
  DataTableForRequestProviderInterface,
} from '../../../interfaces/data-table-for-requests.interface';
import { AllRequestsPcVersionComponent } from "./all-requests-pc-version/all-requests-pc-version.component";
import { AllRequestsMobileVersionComponent } from "./all-requests-mobile-version/all-requests-mobile-version.component";
export enum QuoteOrAnswerStatus {
  NO = 'no',
  COTIZADO = 'Cotizado',
  AGOTADO = 'Agotado',
  NO_ES_MI_CATEGORIA = 'No es mi categoría',
  EXPIRADO = 'Expirado'
}

@Component({
  selector: 'app-all-requests',
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
    AllRequestsPcVersionComponent,
    AllRequestsMobileVersionComponent
],
  templateUrl: './all-requests.component.html',
  styleUrl: './all-requests.component.css',
})
export class AllRequestsComponent implements OnInit {
  requestsAdmin!: DataTableForRequestAdminInterface[];
  requestsProvider!: DataTableForRequestProviderInterface[];
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
  faFrown: IconDefinition = faFaceFrown;

  isCustomerDataLoaded: boolean = false;
  isQuotesDataLoaded: boolean = false;
  isAnswersDataLoaded: boolean = false;
  isSentToDataLoaded: boolean = false;

  splitButtonItems = [
    {
      label: 'Agotado',
      type: 'exhausted',
      hover_bg_color: 'hover:bg-red-300',
      role: [Role.PROVIDER, Role.EMPLOYE],
    },
    {
      label: 'No es mi categoría',
      type: 'no_category',
      hover_bg_color: 'hover:bg-yellow-300',
      role: [Role.PROVIDER, Role.EMPLOYE],
    },
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
    private answerService: AnswerService,
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

  getRequests() {
    this.globalCommunication.loading.emit(true);

    if (this.userRole === Role.ADMIN) {
      this.requestService.getRequests().subscribe({
        next: (requests) => {
          const currentDate = new Date();
          currentDate.setDate(currentDate.getDate() - 1);

          this.requestsAdmin = requests
            .filter((request) => {
              const requestDate = new Date(request.entry_date_unformatted);
              return requestDate >= currentDate;
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
    } else if (this.userRole === Role.PROVIDER) {
      this.requestService.getRequestsForProviders().subscribe({
        next: (requests) => {
          const currentDate = new Date();
          currentDate.setDate(currentDate.getDate() - 1);

          this.requestsProvider = requests.sort((a, b) => {
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
  }

  get requestsToDisplay() {
    return this.userRole === Role.ADMIN
      ? this.requestsAdmin
      : this.requestsProvider;
  }

  showOverlay(event: Event, type: string, requestIdSelected: string) {
    this.requestIdSelected = requestIdSelected;
    if (type === 'splitbutton') {
      this.actions.toggle(event);
    }
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

  @HostListener('window:resize', ['$event'])
  checkScreen() {
    const width = window.innerWidth;
    this.isMobile = width <= 768;
  }

  onSearch(event: Event, dtRequests: any): void {
    const input = event.target as HTMLInputElement;
    const value = input?.value || '';
    dtRequests.filterGlobal(value, 'contains');
  }

  async doAction(type: string, id: string = '', phoneClient: string = '') {
    const validTypes = [
      'quote',
      'exhausted',
      'no_category',
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
      case 'quote':
        this.quote.emit(id);
        break;
      case 'exhausted':
        const answer: PostAnswerInterface = {
          request_id: this.requestIdSelected,
          renter_id: this.renterId,
          answer_type: 'Agotado',
        };

        this.createAnswer(answer);
        break;
      case 'no_category':
        const city = await this.getCityOfRequest(this.requestIdSelected);
        if (city != 'Not found') {
          const answer: PostAnswerInterface = {
            request_id: this.requestIdSelected,
            renter_id: this.renterId,
            answer_type: 'No es mi categoría',
            category: city,
          };
          this.createAnswer(answer);
        }
        break;
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

  hasQuoteOrAnswer(requestId: string): QuoteOrAnswerStatus {
    const request =
      this.userRole === Role.ADMIN
        ? this.requestsAdmin.find((entry) => entry.id === requestId)
        : this.requestsProvider.find((entry) => entry.id === requestId);

    if (!request) {
      return QuoteOrAnswerStatus.NO;
    }

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);

    const requestDate = new Date(request.entry_date_unformatted);

    const isExpired = requestDate < currentDate;

    const hasQuote = request.quotes.some(
      (quote) => quote.renter_id === this.renterId
    );

    if (hasQuote) {
      return QuoteOrAnswerStatus.COTIZADO;
    }

    const answer = request.answers.find(
      (answer) => answer.renter_id === this.renterId
    );

    if(answer){
      return(answer.answer_type as QuoteOrAnswerStatus)
    }

    if(isExpired && !hasQuote && !answer){
      return QuoteOrAnswerStatus.EXPIRADO;
    }

    return QuoteOrAnswerStatus.NO;
  }

  createAnswer(answer: PostAnswerInterface) {
    this.globalCommunication.loading.emit(true);
    this.answerService.createAnswer(answer).subscribe({
      next: (answer) => {
        console.log('Answer created.', answer);
        this.getRequests();
      },
      error: (error) => {
        console.error('Ha ocurrido un error al crear Respuesta:', error);
        this.globalCommunication.loading.emit(false);
      },
      complete: () => {
        this.actions.hide();
        this.globalCommunication.loading.emit(false);
      },
    });
  }

  async getAnswer(
    request_id: string,
    renter_id: string,
    type: 'exhausted' | 'no_category'
  ): Promise<boolean> {
    if (type === 'exhausted') {
      try {
        const answer = await firstValueFrom(
          this.answerService.getAnswer(request_id, renter_id)
        );
        return answer.answer_type === 'Agotado';
      } catch {
        return false;
      }
    } else if (type === 'no_category') {
      try {
        const answer = await firstValueFrom(
          this.answerService.getAnswer(request_id, renter_id)
        );
        return answer.answer_type === 'No es mi categoría';
      } catch {
        return false;
      }
    } else {
      return false;
    }
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

  async getCityOfRequest(id: string): Promise<string> {
    try {
      const request = await firstValueFrom(this.requestService.getRequest(id));
      return request.entry_city;
    } catch (error) {
      return 'Not found';
    }
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
