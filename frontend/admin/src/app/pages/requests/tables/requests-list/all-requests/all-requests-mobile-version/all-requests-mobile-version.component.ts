import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuoteOrAnswerStatus } from '../all-requests.component';
import { Role } from '../../../../../../common/enums/roles';
import {
  DataTableForRequestAdminInterface,
  DataTableForRequestProviderInterface,
} from '../../../../interfaces/data-table-for-requests.interface';
import { Icon, IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown, faCaretLeft, faCaretRight, faCheck, faFaceFrown, faPaperPlane, faSearch } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommunicationService } from '../../../../../../common/services/communication.service';
import { RequestDataService } from '../../../../services/request-data.service';
import { GetRequestInterface } from '../../../../interfaces/request.interface';

@Component({
  selector: 'all-requests-app-mobile-version',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './all-requests-mobile-version.component.html',
  styleUrl: './all-requests-mobile-version.component.css',
})
export class AllRequestsMobileVersionComponent {
  @Input() requests!: DataTableForRequestAdminInterface[]
    | DataTableForRequestProviderInterface[];
  requestDetails!: GetRequestInterface;
  @Input() userRole!: string;
  @Input() renterId!: string;
  isDetailsModalVisible: boolean = false;

  // requestsFiltered: { [key: string]: boolean } = {
  //   created_at: true,
  //   entry_date: true,
  //   devolution_date: true,
  //   entry_city: true,
  // };

  @Output() doAction = new EventEmitter<{
    type: string;
    id?: string;
    phoneClient?: string;
  }>();
  @Output() showOverlay = new EventEmitter<{
    event: Event;
    type: string;
    requestIdSelected: string;
  }>();
  Role = Role;

  //Iconos
  faCaretDown: IconDefinition = faCaretDown;
  faCaretRight: IconDefinition = faCaretRight;
  faCaretLeft: IconDefinition = faCaretLeft;
  faPaperPlane: IconDefinition = faPaperPlane;
  faCheck: IconDefinition = faCheck;
  faFrown: IconDefinition = faFaceFrown;
  faSearch: IconDefinition = faSearch;

  currentPage = 1;
  itemsPerPage = 5;

  constructor(
    private communicationService: CommunicationService,
    private requestService: RequestDataService
  ){}

  // sortRequests(property: string) {
  //   if (!(property in this.requestsFiltered)) {
  //     this.requestsFiltered[property] = true;
  //   }

  //   this.requestsFiltered[property] = !this.requestsFiltered[property];

  //   this.requests.sort((a: any, b: any) => {
  //     const valueA = a[property] instanceof Date ? a[property].getTime() : new Date(a[property]).getTime();
  //     const valueB = b[property] instanceof Date ? b[property].getTime() : new Date(b[property]).getTime();

  //     return this.requestsFiltered[property] ? valueA - valueB : valueB - valueA;
  //   });
  // }

  get paginatedRequestsForAdmin() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return (this.requests as DataTableForRequestAdminInterface[]).slice(startIndex, startIndex + this.itemsPerPage);
  }

  get paginatedRequestsForProvider(){
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return (this.requests as DataTableForRequestProviderInterface[]).slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
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

  get totalPages() {
    return Math.ceil(this.requests.length / this.itemsPerPage);
  }

  get visiblePages() {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    const totalPages = this.totalPages;
    const current = this.currentPage;

    let start = Math.max(1, current - half);
    let end = Math.min(totalPages, current + half);

    if (current <= half) {
      end = Math.min(totalPages, maxVisible);
    } else if (current + half >= totalPages) {
      start = Math.max(1, totalPages - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  onSearch(event: Event, dtRequests: any): void {
    const input = event.target as HTMLInputElement;
    const value = input?.value || '';
    dtRequests.filterGlobal(value, 'contains');
  }

  ejecutarAccion(type: string, id?: string, phoneClient?: string) {
    if(type === 'delete'){
      this.isDetailsModalVisible = false;
    }
    this.doAction.emit({ type, id, phoneClient });
  }

  mostrarOverlay(event: Event, type: string, requestIdSelected: string) {
    this.showOverlay.emit({ event, type, requestIdSelected });
  }

  hasQuoteOrAnswer(requestId: string): QuoteOrAnswerStatus {
    const request = this.requests.find((entry) => entry.id === requestId);

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

    if (answer) {
      return answer.answer_type as QuoteOrAnswerStatus;
    }

    if (isExpired && !hasQuote && !answer) {
      return QuoteOrAnswerStatus.EXPIRADO;
    }

    return QuoteOrAnswerStatus.NO;
  }

  toggleModal(type: string, id?: string) {
    const acceptedTypes = ['quote', 'details'];

    if (!acceptedTypes.includes(type)) {
      return;
    } else if (type === 'details') {
      if(id){
        this.getRequestDetails(id);
      }else{
        this.isDetailsModalVisible = false;
      }
    }
  }

  getRequestDetails(id: string){
    this.communicationService.loading.emit(true);
    this.requestService.getRequest(id).subscribe({
      next: request => {
        this.requestDetails = request;
        this.isDetailsModalVisible = true;
        this.communicationService.loading.emit(false);
      },
      error: e => {
        console.error('Error al obtener la solicitud.', e);
      }
    });
  }
}
