import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, output } from '@angular/core';
import { GetQuoteInterface } from '../../../../../quotes/interfaces/quote.interface';
import { TableModule } from 'primeng/table';
import { CommunicationService } from '../../../../../../common/services/communication.service';
import { QuoteDataService } from '../../../../../quotes/services/quote-data.service';
import { firstValueFrom } from 'rxjs';
import { ProviderDataService } from '../../../../../providers/services/provider-data.service';
import { RequestDataService } from '../../../../services/request-data.service';
import { TransmissionService } from '../../../../../../common/services/transmission.service';

interface QuoteDataForTable extends GetQuoteInterface {
  provider_name: string;
  provider_phone: string;
  customer_name: string;
  transmission: string;
}

@Component({
  selector: 'app-quotes-data',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './quotes-data.component.html',
  styleUrl: './quotes-data.component.css',
})
export class QuotesDataComponent implements OnInit {
  quotesData!: QuoteDataForTable[];
  quoteData!: QuoteDataForTable;
  @Input() requestId!: string;
  toggleModalEmitter = output<string>();
  doActionEmitter = output<string[]>();
  showActions = output<boolean>();
  isQuotesDataLoaded = output<boolean>();
  isDetailsModalVisible: boolean = false;

  private transmissionCache = new Map<string, string>()

  constructor(
    private globalCommunication: CommunicationService,
    private quoteService: QuoteDataService,
    private providerService: ProviderDataService,
    private requestService: RequestDataService,
    private transmissionService: TransmissionService
  ) {}

  ngOnInit(): void {
    this.getQuotesWhereId(this.requestId);
  }

  toggleModal(type: string, id?: string) {
    const acceptedTypes = ['quote', 'details'];

    if (!acceptedTypes.includes(type)) {
      return;
    } else if (type === 'quote') {
      this.toggleModalEmitter.emit(type);
    } else if (type === 'details') {
      if(id){
        this.getQuoteDetails(id);
      }else{
        this.isDetailsModalVisible = false;
      }
    }
  }

  doAction(type: string, id: string) {
    this.doActionEmitter.emit([type, id]);
  }

  getQuotesWhereId(requestId: string) {
    this.globalCommunication.loading.emit(true);
    this.quoteService.getQuotesWhereRequestId(requestId).subscribe({
      next: async (quotes) => {
        if (quotes.length > 0) {
          try {
            const quotesWithDetails = await Promise.all(
              quotes.map(async (quote) => {
                const providerName = await this.getProvider(quote.renter_id);
                const customerName = await this.getCustomerName(
                  quote.request_id
                );
                const transmission = await this.getTransmission(quote.transmission_id);
                return {
                  ...quote,
                  provider_name: providerName[0],
                  provider_phone: providerName[1],
                  customer_name: customerName,
                  transmission: transmission
                };
              })
            );

            this.quotesData = quotesWithDetails;

            this.isQuotesDataLoaded.emit(true);
          } catch (error) {
            console.error('Error while processing quotes.', error);
          } finally {
            this.globalCommunication.loading.emit(false);
          }
        } else {
          alert('Esta solicitud no tiene cotizaciones');
        }
        this.showActions.emit(false);
      },
      error: (error) => {
        alert('Esta solicitud no tiene cotizaciones');
        console.error('Error al obtener cotizaciones.', error);
        this.isQuotesDataLoaded.emit(false);
        this.globalCommunication.loading.emit(false);
      },
    });
  }

  getQuoteDetails(quoteId: string) {
    this.globalCommunication.loading.emit(true);
    this.quoteService.getQuote(quoteId).subscribe({
      next: async (quote) => {
        if (quote) {
          try {
            const providerName = await this.getProvider(quote.renter_id);
            const customerName = await this.getCustomerName(quote.request_id);
            const transmission = await this.getTransmission(quote.transmission_id);
            this.quoteData = {
              ...quote,
                  provider_name: providerName[0],
                  provider_phone: providerName[1],
                  customer_name: customerName,
                  transmission: transmission
            };

            this.isDetailsModalVisible = true;
          } catch (error) {
            console.error('Error while processing quotes.', error);
          } finally {
            this.globalCommunication.loading.emit(false);
          }
        } else {
          alert('Esta solicitud no tiene cotizaciones');
        }
        this.showActions.emit(false);
      },
      error: (error) => {
        alert('Esta solicitud no tiene cotizaciones');
        console.error('Error al obtener cotizaciones.', error);
        this.isDetailsModalVisible = false;
        this.globalCommunication.loading.emit(false);
      },
    });
  }

  async getProvider(providerId: string) {
    try {
      const provider = await firstValueFrom(
        this.providerService.getProviderWithId(providerId)
      );
      return [provider.name, provider.phone];
    } catch {
      return 'Error al obtener el proveedor';
    }
  }

  async getCustomerName(id: string) {
    try {
      const request = await firstValueFrom(this.requestService.getRequest(id));
      return request.name;
    } catch {
      return 'Error al obtener el proveedor';
    }
  }

  async getTransmission(id: string): Promise<string> {
    if (this.transmissionCache.has(id)) {
      return this.transmissionCache.get(id)!;
    }
    try {
      const transmission = await firstValueFrom(
        this.transmissionService.getTransmission(id)
      );
      this.transmissionCache.set(id, transmission.name);
      return transmission.name;
    } catch {
      return 'Error al obtener la transmision';
    }
  }
}
