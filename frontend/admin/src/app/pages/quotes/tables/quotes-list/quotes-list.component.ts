import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { GetQuoteInterface } from '../../interfaces/quote.interface';
import { QuoteDataService } from '../../services/quote-data.service';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { GetRequestInterface } from '../../../requests/interfaces/request.interface';
import { RequestDataService } from '../../../requests/services/request-data.service';
import { dataForModalOfQuoteInterface } from '../../interfaces/data-for-modal-of-quote.interface';
import { CommunicationService } from '../../../../common/services/communication.service';
import { GammaService } from '../../../../common/services/gamma.service';
import { TransmissionService } from '../../../../common/services/transmission.service';
import { ProviderDataService } from '../../../providers/services/provider-data.service';
import { GetProviderInterface } from '../../../providers/interfaces/provider.interface';
import { GeolocationService } from '../../../../common/services/geolocation.service';

interface quoteDataList{
  id: string;
  request_id: string;
  renter_id: string;
  phone_client: string;
  rent: number;
  total_value: number;
  brand: string;
  transmission: string;
  model: number;
  color: string;
  plate_end_in: string;
  value_to_block_on_credit_card: number;
  allowed_payment_method: string;
  available_kilometers: string;
  percentage_of_total_value: string;
  percentage_in_values: number;
  comments?: string;
  created_at: Date;
}

@Component({
  selector: 'app-quotes-list',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, OverlayPanelModule, TableModule],
  templateUrl: './quotes-list.component.html',
  styleUrl: './quotes-list.component.css',
  providers: [DatePipe]
})
export class QuotesListComponent implements OnInit {
  quotes!: quoteDataList[];
  quoteId!: string;
  request!: GetRequestInterface;
  provider!: GetProviderInterface;

  //Overlays
  @ViewChild('actions') actions!: OverlayPanel;

  isModalVisible: boolean = false;
  dataModal!: dataForModalOfQuoteInterface;

  //icons
  faCaretDown: IconDefinition = faCaretDown;

  splitButtonItems = [
    {
      label: 'Eliminar',
      type: 'delete',
    },
  ];

  constructor(private cdr: ChangeDetectorRef, private quoteService: QuoteDataService, private requestService: RequestDataService, private communicationService: CommunicationService, private gammaService: GammaService, private transmissionService: TransmissionService, private datePipe: DatePipe, private providerService: ProviderDataService, private geolocationService: GeolocationService){}

  ngOnInit(): void {
    this.getQuotes();
  }

  async getQuotes() {
    this.communicationService.loading.emit(true);

    this.quoteService.getQuotes().subscribe({
      next: async (quotes) => {
        try {
          const quotesWithDetails = await Promise.all(
            quotes.map(async (quote) => {
              const transmission = await this.getTransmission(
                quote.transmission_id
              );

              return {
                id: quote.id,
                request_id: quote.request_id,
                renter_id: quote.renter_id,
                phone_client: quote.phone_client,
                rent: quote.rent,
                total_value: quote.total_value,
                brand: quote.brand,
                transmission: transmission,
                model: quote.model,
                color: quote.color,
                plate_end_in: quote.plate_end_in,
                value_to_block_on_credit_card: quote.value_to_block_on_credit_card,
                allowed_payment_method: quote.allowed_payment_method,
                available_kilometers: quote.available_kilometers,
                percentage_of_total_value: quote.percentage_of_total_value,
                percentage_in_values: quote.percentage_in_values,
                comments: quote.comments || 'No hay comentarios',
                created_at: quote.created_at
              }}
          ));

          this.quotes = quotesWithDetails;
          this.cdr.detectChanges();
        } catch (error) {
          console.error('Error while processing requests:', error);
        } finally {
          this.communicationService.loading.emit(false);
        }
      },
      error: (err) => {
        console.error('Error fetching requests:', err);
        this.communicationService.loading.emit(false);
      },
    });
  }

  showOverlay(event: Event, type: 'splitbutton', id: string = '') {
    this.quoteId = id;
    if (type === 'splitbutton') {
      this.actions.toggle(event);
    }
  }

  async doAction(type: string, id: string = '') {
    switch (type) {
      case 'delete':
        await this.delete(this.quoteId);
        break;
      case 'showRequest':
        this.getRequest(id);
        break;
      case 'showProvider':
        this.getProviderData(id);
        break;
      case 'hideModal':
        this.isModalVisible = false;
        break;
      default:
        console.error('No se ha seleccionado una opcion correcta');
    }
  }

  async delete(id: string){
    this.quoteService.deleteQuote(id).subscribe({
      next: quoteDeleted => {
        console.log('Quote deleted.', quoteDeleted);
        this.getQuotes();
      },
      error: error => {
        console.error('Error to delete quote.', error)
      }
    });
  }

  async getRequest(id: string) {
    this.communicationService.loading.emit(true);
    try {
      const request = await this.requestService.getRequest(id).toPromise();
      this.request = request!;

      const entry_date = `${this.request.entry_date}`;
      const formattedEntryDate = this.datePipe.transform(
        entry_date,
        'fullDate',
        'es-ES'
      );
      const devolutionDate = `${this.request.devolution_date}`;
      const formattedDevolutionDate = this.datePipe.transform(
        devolutionDate,
        'fullDate',
        'es-ES'
      );

      this.dataModal = {
        title: 'Solicitud de ' + this.request.name,
        subtitles: [
          'Nombre:',
          'Email:',
          'Celular:',
          'Comentarios:',
          'Ciudad de entrega:',
          'Recibe en aeropuerto?:',
          'Fecha de entrega:',
          'Ciudad de devolución:',
          'Devuelve en aeropuerto?:',
          'Fecha de devolución:',
          'Gama:',
          'Transmisión:',
          'Fecha creación:',
        ],
        paragraphs: [
          this.request.name,
          this.request.email ?? '',
          this.request.phone,
          this.request.comments ?? '',
          this.request.entry_city,
          this.request.receive_at_airport ? 'Sí' : 'No',
          `${formattedEntryDate} a las ${this.request.entry_time}`,
          this.request.devolution_city,
          this.request.returns_at_airport ? 'Sí' : 'No',
          `${formattedDevolutionDate} a las ${this.request.devolution_time}`,
          this.request.gamma,
          this.request.transmission,
        ],
      };

      this.isModalVisible = true;
      this.communicationService.loading.emit(false);
    } catch (error) {
      this.communicationService.loading.emit(false);
      this.isModalVisible = false;
      console.error('Error al obtener la solicitud:', error);
    }
  }

  getProviderWithId(id: string) {
    return new Promise<GetProviderInterface>((resolve, reject) => {
      this.providerService.getProviderWithId(id).subscribe({
        next: (provider) => resolve(provider),
        error: () => reject('Error al obtener el proveedor'),
      });
    });
  }

  async getProviderData(id: string) {
    this.communicationService.loading.emit(true);
    this.getProviderWithId(id)
    .then((provider) => {
      this.dataModal = {
        title: 'Detalles del proveedor',
        subtitles: [
          'Nombre:',
          'NIT:',
          'Celular:',
          'Email:',
          'Dirección:'
        ],
        paragraphs: [
          provider.name,
          provider.nit,
          provider.phone,
          provider.email,
          provider.address,
        ],
      };

      this.isModalVisible = true;
      this.communicationService.loading.emit(false);
    })
    .catch((error) => {
      console.error('Error al obtener el proveedor:', error);
      this.communicationService.loading.emit(false);
    });
  }


  getCity(id: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.geolocationService.getGlobalCity(id).subscribe({
        next: (city) => resolve(city.name),
        error: () => reject('Error al obtener la ciudad'),
      });
    });
  }

  getGamma(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.gammaService.getGamma(id).subscribe({
        next: (gamma) => resolve(gamma.name),
        error: () => reject('Error al obtener la gama'),
      });
    });
  }

  getTransmission(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.transmissionService.getTransmission(id).subscribe({
        next: (transmission) => resolve(transmission.name),
        error: () => reject('Error al obtener la transmisión'),
      });
    });
  }

  getDaysOfRent(entryDate: string, devolutionDate: string) {
    const startDate = new Date(entryDate);
    const endDate = new Date(devolutionDate);

    const differenceInTime = endDate.getTime() - startDate.getTime();

    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    return Math.ceil(differenceInDays);
  }

}
