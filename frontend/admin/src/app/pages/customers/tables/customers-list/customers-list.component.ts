import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { GetCustomerInterface, UpdateCustomerModel } from '../../interfaces/customer.interface';
import { DataForModalOfReservationsToBeConfirmed } from './interfaces/data-modal.interface';
import { QuoteDataService } from '../../../quotes/services/quote-data.service';
import { GetQuoteInterface } from '../../../quotes/interfaces/quote.interface';
import { CommunicationService } from '../../../../common/services/communication.service';
import { RequestDataService } from '../../../requests/services/request-data.service';
import { DataCommonService } from '../../../../common/services/data-common.service';
import { GetRequestInterface } from '../../../requests/interfaces/request.interface';
import { GetProviderInterface } from '../../../providers/interfaces/provider.interface';
import { ProviderDataService } from '../../../providers/services/provider-data.service';
import { CustomerDataService } from '../../services/customer-data.service';
import { ReservationConfirmationModel } from '../../../requests/interfaces/reservation-confirmation.interface';
import { GeolocationService } from '../../../../common/services/geolocation.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrashAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, TableModule, FontAwesomeModule],
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.css',
  providers: [DatePipe]
})
export class CustomersListComponent implements OnInit {
  activeItem = 0;
  customersWithoutConfirmingPayment: GetCustomerInterface[] = [];
  customers: GetCustomerInterface[] = [];

  isModalVisible: boolean = false;
  dataModal!: DataForModalOfReservationsToBeConfirmed;

  //Icons
  faTrash: IconDefinition = faTrashAlt;

  quote!: GetQuoteInterface;
  request!: GetRequestInterface;

  items = [{ label: 'Clientes sin confirmar' }, { label: 'Clientes' }];

  constructor(
    private quoteService: QuoteDataService,
    private communicationService: CommunicationService,
    private requestService: RequestDataService,
    private dataCommon: DataCommonService,
    private geolocationService: GeolocationService,
    private providerService: ProviderDataService,
    private datePipe: DatePipe,
    private customerService: CustomerDataService
  ) {}

  ngOnInit(): void {
    this.getCustomers();
    this.getCustomersWithoutConfirmingPayment();
  }

  setActiveTab(index: number) {
    this.activeItem = index;
  }

  getProviderWithId(id: string) {
    return new Promise<GetProviderInterface>((resolve, reject) => {
      this.providerService.getProviderWithId(id).subscribe({
        next: (provider) => resolve(provider),
        error: () => reject('Error al obtener el proveedor'),
      });
    });
  }

  getQuote(id: string) {
    this.quoteService.getQuote(id).subscribe({
      next: (quote) => {
        if (quote) {
          this.quote = quote;

          const rent = this.formatCurrency(this.quote.rent);
          const totalValue = this.formatCurrency(this.quote.total_value);
          const formatPercentageInValues = this.formatCurrency(
            this.quote.percentage_in_values
          );
          this.communicationService.loading.emit(true);
          this.getTransmission(this.quote.transmission_id)
            .then((transmission) => {
              this.getProviderWithId(this.quote.renter_id)
                .then((provider) => {
                  this.dataModal = {
                    title: 'Cotización de ' + provider.name,
                    subtitles: [
                      'Valor renta:',
                      'Valor Total:',
                      'Porcentaje de renta:',
                      'Valor de porcentaje:',
                      'Marca:',
                      'Transmisión:',
                      'Comentarios:',
                    ],
                    paragraphs: [
                      rent,
                      totalValue,
                      this.quote.percentage_of_total_value,
                      formatPercentageInValues,
                      this.quote.brand,
                      transmission,
                      this.quote.comments ?? '',
                    ],
                  };

                  this.isModalVisible = true;
                  this.communicationService.loading.emit(false);
                })
                .catch((error) => {
                  console.error('Error al obtener el proveedor:', error);
                  this.communicationService.loading.emit(false);
                });
            })
            .catch((error) => {
              console.error('Error al obtener la transmisión:', error);
              this.communicationService.loading.emit(false);
            });
        } else {
          console.log('Quote not found');
          this.communicationService.loading.emit(false);
        }
      },
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  toggleModal(
    id?: string,
    phone?: string,
    type?: 'customer' | 'request' | 'quote'
  ) {
    if (type === 'request') {
      this.getRequest(id || '');
    } else if (type === 'customer') {
      this.getRequest(id || '');
    } else if (type === 'quote' && phone) {
      this.getQuote(id ?? '');
    } else {
      this.isModalVisible = false;
    }
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
      console.error('Error al obtener la solicitud:', error);
    }
  }

  getCity(id: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.geolocationService.getGlobalCity(id).subscribe({
        next: (city) => resolve(city.name),
        error: () => reject('Error al obtener la ciudad'),
      });
    });
  }

  getTransmission(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.dataCommon.getTransmission(id).subscribe({
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

  getCustomersWithoutConfirmingPayment() {
    this.customerService.getCustomersWithoutConfirmingPayment().subscribe({
      next: (customers) => {
        this.customersWithoutConfirmingPayment = customers;
      },
      error: (error) => {
        console.error('Ha ocurrido un error:', error);
      },
    });
  }

  getCustomers(){
    this.communicationService.loading.emit(true);
    this.customerService.getCustomers().subscribe({
      next: customers => {
        this.customers = customers;
        this.communicationService.loading.emit(false);
      },
      error: e => {
        console.error('Error al obtener clientes', e);
        this.communicationService.loading.emit(false);
      }
    });
  }

  deleteCustomer(id: string){
    this.communicationService.loading.emit(true);
    this.customerService.deleteCustomerById(id).subscribe({
      next: customer => {
        console.log('Customer deleted.', customer);
        this.getCustomersWithoutConfirmingPayment();
        this.getCustomers()
      }
    });
  }

  onSearch(event: Event, dtRequests: any): void {
    const input = event.target as HTMLInputElement;
    const value = input?.value || '';
    dtRequests.filterGlobal(value, 'contains');
  }

  get globalFields() {
    const fieldsForAdmin = [
      'identification',
      'credit_card_holder_name',
      'gender',
      'birthdate',
      'email',
      'phone',
      'country',
      'city',
      'address',
      'created_at'
    ];
    return fieldsForAdmin;
  }

  async sendConfirmation(
    id: string,
    customer: UpdateCustomerModel,
    request_id: string,
    quote_id: string
  ) {
    this.communicationService.loading.emit(true);

    this.quoteService.getQuote(quote_id).subscribe({
      next: quote => {
        this.quote = quote;

        this.requestService.getRequest(request_id).subscribe({
          next: async (request) => {
            this.request = request;

            const transmission = await this.getTransmission(
              this.quote?.transmission_id || ''
            );
            const entry_date = `${this.request.entry_date}`;
            const formattedEntryDate = this.datePipe.transform(
              entry_date,
              'fullDate',
              'es-ES'
            );
            const renter = await this.getProviderWithId(
              this.quote?.renter_id || ''
            );
            const renterCity = await this.getCity(renter?.city_id);

            const reservationConfirmation: ReservationConfirmationModel = {
              vehicle: this.quote?.brand || '',
              transmission: transmission,
              model: this.quote?.model || 0,
              entryCity: request.entry_city,
              entryDateAndTime: `${formattedEntryDate} a las ${this.request.entry_time}`,
              days: this.getDaysOfRent(
                this.request.entry_date.toString(),
                this.request.devolution_date.toString()
              ),
              totalOfRent: this.quote?.total_value || 0,
              percentageOfRent: this.quote?.percentage_of_total_value || '15%',
              percentageInValues: this.quote?.percentage_in_values || 0,
              agency: renter?.name || 'Nombre no disponible',
              phones: [this.request.phone, renter?.phone || ''],
              contact: [this.request.name, renter?.name || ''],
              city: [customer.city || '', renterCity || ''],
              address: [customer.address || '', renter?.address || ''],
              ids: [id, this.request.id, this.quote?.id || ''],
            };

            this.requestService
              .sendReservationConfirmation(reservationConfirmation)
              .subscribe({
                next: (reservation) => {
                  const customerUpdated: UpdateCustomerModel = {
                    identification: customer.identification,
                    confirmed_payment: true
                  }
                  this.customerService.updateCustomer(id, customerUpdated).subscribe({
                    next: (customer) => {
                      console.log(
                        'Confirmado correctamente:',
                        customer,
                        'Reserva:',
                        reservation
                      );
                    },
                    error: (error) => {
                      this.communicationService.loading.emit(false);
                      console.error('Error:', error);
                    },
                    complete: () => {
                      this.getCustomersWithoutConfirmingPayment();
                      this.getCustomers()
                    },
                  });
                },
                error: (err) => {
                  console.error('Ha ocurrido un error:', err);
                  this.communicationService.loading.emit(false);
                },
              });
          },
          error: (err) => {
            console.error('Error:', err);
            this.communicationService.loading.emit(false);
          },
        });
      },
      error: (error) => {
        console.error('Error:', error);
      }
    })
  }
}
