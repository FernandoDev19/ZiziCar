import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommunicationService } from '../../../../../common/services/communication.service';
import { Role } from '../../../../../common/enums/roles';
import { PostAnswerInterface } from '../../../../../common/interfaces/common.interface';
import { RequestDataService } from '../../../services/request-data.service';
import { firstValueFrom } from 'rxjs';
import { GammaService } from '../../../../../common/services/gamma.service';
import { AnswerService } from '../../../../../common/services/answer.service';
import { ConfirmationService } from 'primeng/api';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { QuoteDataService } from '../../../../quotes/services/quote-data.service';
import { ButtonModule } from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { QuotesDataComponent } from '../modals/quotes-data/quotes-data.component';
import { CustomerDataComponent } from '../modals/customer-data/customer-data.component';
import { ProviderDataComponent } from '../modals/provider-data/provider-data.component';
import { AnswerDataComponent } from '../modals/answer-data/answer-data.component';
import { DataTableForRequestProviderInterface } from '../../../interfaces/data-table-for-requests.interface';
import { GetUserInterface } from '../../../../users-roles/users/interfaces/user.interface';
import { QuotedRequestsPcVersionComponent } from "./quoted-requests-pc-version/quoted-requests-pc-version.component";
import { QuotedRequestsMobileVersionComponent } from "./quoted-requests-mobile-version/quoted-requests-mobile-version.component";

@Component({
  selector: 'app-quoted-requests',
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
    QuotedRequestsPcVersionComponent,
    QuotedRequestsMobileVersionComponent
],
  templateUrl: './quoted-requests.component.html',
  styleUrl: './quoted-requests.component.css',
  providers: [DatePipe],
})
export class QuotedRequestsComponent  implements OnInit {
  requests!: DataTableForRequestProviderInterface[];
  isMobile: boolean = false;

  requestQuote!: boolean;
  requestIdSelected!: string;
  requestExhausted!: boolean;
  requestNoCategory!: boolean;
  phoneClient!: string;

  @Input() userRegistered!: GetUserInterface;
  renterId: string = '';
  userRole!: Role;
  Role = Role;

  @Output() quote = new EventEmitter<string>();

  //Overlays
   @ViewChild('actions') actions!: OverlayPanel;

   // Iconos
   faCaretDown: IconDefinition = faCaretDown;

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
    private gammaService: GammaService,
    private answerService: AnswerService,
    private confirmationService: ConfirmationService,
    private quoteService: QuoteDataService
  ){}

  ngOnInit(): void {
    this.getAuthUser();
    this.checkScreen();
  }

  getAuthUser() {
    this.userRole = this.userRegistered.role as Role;
    this.renterId = this.userRegistered.provider_id || '';
    if(this.userRegistered.provider_id){
      this.getRequests();
    }
  }

  getRequests() {
    this.globalCommunication.loading.emit(true);

    this.requestService.getRequestsForProviders().subscribe({
      next: (requests) => {
        this.requests = requests.filter((request) => {
            return request.quotes.some(
              (quote) => quote.renter_id === this.renterId
            );
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

  @HostListener('window:resize', ['$event'])
  checkScreen() {
    const width = window.innerWidth;
    this.isMobile = width <= 768;
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

  onSearch(event: Event, dtRequests: any): void {
    const input = event.target as HTMLInputElement;
    const value = input?.value || '';
    dtRequests.filterGlobal(value, 'contains');
  }

  get globalFields(){
    const fieldsForAdmin = ['name', 'phone', 'gamma', 'transmission', 'entry_city', 'entry_date', 'comments',  'devolution_city', 'devolution_date'];
    const fieldsForProvider = ['gamma', 'entry_city',  'transmission', 'entry_date', 'comments',  'devolution_city', 'devolution_date'];
    return this.userRole === Role.ADMIN ? fieldsForAdmin  : fieldsForProvider ;
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
        const gamma = await this.getGammaForCategory(id);
        if (gamma != 'Not found') {
          const answer: PostAnswerInterface = {
            request_id: this.requestIdSelected,
            renter_id: this.renterId,
            answer_type: 'No es mi categoría',
            category: gamma,
          };
          this.createAnswer(answer);
        }
        break;
      case 'delete':
        this.confirmAction(this.requestIdSelected);
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

  getButtonClasses(item: {
    label: string;
    type: string;
    hover_bg_color: string;
    role: Role[];
  }): { [key: string]: boolean } {
    const classes: { [key: string]: boolean } = {
      'hover:text-white':
        !this.requestQuote && !this.requestExhausted && !this.requestNoCategory,
    };

    if (
      (!this.requestQuote &&
        !this.requestExhausted &&
        !this.requestNoCategory) ||
      this.userRole === Role.ADMIN
    ) {
      classes[item.hover_bg_color] = true;
    }

    return classes;
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

  async getGammaForCategory(id: string): Promise<string> {
    try {
      const request = await firstValueFrom(this.requestService.getRequest(id));
      return request.gamma;
    } catch (error) {
      return 'Not found';
    }
  }

  async quoteExist(requestId: string): Promise<boolean> {
    try {
      const quote = await firstValueFrom(
        this.quoteService.quoteExist(requestId, this.renterId)
      );
      return !!quote;
    } catch {
      return false;
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
