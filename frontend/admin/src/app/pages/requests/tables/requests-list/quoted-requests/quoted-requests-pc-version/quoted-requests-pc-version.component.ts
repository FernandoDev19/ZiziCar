import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TableModule } from 'primeng/table';
import { DataTableForRequestProviderInterface } from '../../../../interfaces/data-table-for-requests.interface';
import { Role } from '../../../../../../common/enums/roles';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown, faCheck, faFaceFrown, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { QuoteOrAnswerStatus } from '../../all-requests/all-requests.component';

@Component({
  selector: 'app-quoted-requests-pc-version',
  standalone: true,
  imports: [CommonModule, TableModule, FontAwesomeModule],
  templateUrl: './quoted-requests-pc-version.component.html',
  styleUrl: './quoted-requests-pc-version.component.css'
})
export class QuotedRequestsPcVersionComponent {
  @Input() requests!: DataTableForRequestProviderInterface[];
  @Input() userRole!: string;
  @Input() renterId!: string;

  @Output() doAction = new EventEmitter<{ type: string; id?: string; phoneClient?: string }>();
  @Output() showOverlay = new EventEmitter<{ event: Event; type: string; requestIdSelected: string }>();
  Role = Role;

  //Iconos
  faCaretDown: IconDefinition = faCaretDown;
  faPaperPlane: IconDefinition = faPaperPlane;
  faCheck: IconDefinition = faCheck;
  faFrown: IconDefinition = faFaceFrown;

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

  onSearch(event: Event, dtRequests: any): void {
    const input = event.target as HTMLInputElement;
    const value = input?.value || '';
    dtRequests.filterGlobal(value, 'contains');
  }

  ejecutarAccion(type: string, id?: string, phoneClient?: string){
    this.doAction.emit({type, id, phoneClient});
  }

  mostrarOverlay(event: Event, type: string, requestIdSelected: string){
    this.showOverlay.emit({event, type, requestIdSelected});
  }

  hasQuoteOrAnswer(requestId: string): QuoteOrAnswerStatus {
    const request = this.requests.find((entry) => entry.id === requestId)

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
}
