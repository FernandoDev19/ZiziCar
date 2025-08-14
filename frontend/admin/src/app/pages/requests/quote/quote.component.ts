import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CommonModule, DatePipe } from '@angular/common';
import { GetTransmissionModel } from '../../../common/interfaces/common.interface';
import { RequestDataService } from '../services/request-data.service';
import { TransmissionService } from '../../../common/services/transmission.service';
import { QuoteDataService } from '../../quotes/services/quote-data.service';
import { CommunicationService } from '../../../common/services/communication.service';
import { PostQuoteInterface } from '../../quotes/interfaces/quote.interface';
import { ProfileService } from '../../../common/services/profile.service';
import { DetailsRequestComponent } from './details-request/details-request.component';
import { Checkbox, CheckboxModule } from 'primeng/checkbox';

export interface DataForRequestInformationInterface {
  gamma: string;
  transmission: string;
  days_of_rent?: number;
  entry_city: string;
  receive_at_airport: string;
  entry_date: string;
  entry_time: string;
  devolution_city: string;
  returns_at_airport: string;
  devolution_date: string;
  devolution_time: string;
  comments: string | null;
}

@Component({
  selector: 'app-quote',
  standalone: true,
  imports: [
    CommonModule,
    OverlayPanelModule,
    ReactiveFormsModule,
    DetailsRequestComponent,
    CheckboxModule
  ],
  templateUrl: './quote.component.html',
  styleUrl: './quote.component.css',
  providers: [DatePipe],
})
export class QuoteComponent implements OnInit, AfterViewInit {
  formAnswer!: FormGroup;
  totalValueOfRentPerDay!: number;

  currentPage = 1;
  valuePerDay: boolean = true;

  isMobile: boolean = false;

  paymentMethodRequired: boolean = false;

  @Output() quote = new EventEmitter<void>();
  @Input('requestId') requestId!: string;
  @Output() scrollTo = new EventEmitter<number>();

  // Overlays
  overlayWidth: string = '450px';
  overlayMaxHeight: string = '300px';
  @ViewChild('transmissionContainer') transmissionContainer!: ElementRef;
  @ViewChild('overlayTransmission') overlayTransmission!: OverlayPanel;
  @ViewChild('overlayModel') overlayModel!: OverlayPanel;
  @ViewChild('overlayFuel') overlayFuel!: OverlayPanel;
  @ViewChild('overlayColor') overlayColor!: OverlayPanel;
  @ViewChild('overlayPlate') overlayPlate!: OverlayPanel;
  @ViewChild('overlayPaymentMethod') overlayPaymentMethod!: OverlayPanel;
  @ViewChild('overlayBrand') overlayBrand!: OverlayPanel;

  //Datos de la solicitud
  dataForRequestInformation!: DataForRequestInformationInterface;
  phoneClientRequest!: string;

  // Datos del formulario
  percentage_of_rent!: number;
  allowed_payment_method!: string;
  @ViewChild('percentageOfRent') percentageOfRent!: ElementRef;

  brandsList: string[] = [
    'Chevrolet Beat o similar',
    'Chevrolet Captiva Premier o similar',
    'Chevrolet Joy o similar',
    'Chevrolet Onix o similar',
    'Chevrolet Onix Sedán o similar',
    'Chevrolet spark GT o similar',
    'Chevrolet Trailblazer o similar',
    'Chevrolet Traverse o similar',
    'Gama C (Suzuki S-Presso, Renault Kwid)',
    'Gama F (Renault Logan, Suzuki Swift)',
    'Gama Fx (Hyundai Accent Advance, Renault Logan Dynamique)',
    'Kia Picanto o similar',
    'Kia Río o similar',
    'Kia Sportage o similar',
    'Kia Karens o similar',
    'Mazda 2 o similar',
    'Mazda 3 o similar',
    'Mazda 6 o similar',
    'Mazda Cx5 o similar',
    'Nissan March o similar',
    'Nissan Versa o similar',
    'Nissan Qashqai o similar',
    'Renault Duster Turbo o similar',
    'Renault Duster o similar',
    'Renault Kwid o similar',
    'Renault Logan o similar',
    'Renault Alaskan o similar',
    'Renault Sandero o similar',
    'Renault Sandero Stepway o similar',
    'Suzuki baleno o similar',
    'Suzuki Swift o similar',
    'Toyota Fortuner SW4 o similar',
    'Toyota Fortuner Urbana o similar',
    'Toyota Prado TX.L o similar',
    'Toyota Yaris o similar',
    'Volkswagen Gol o similar',
  ]; // Obtener de la db
  transmissionsList!: GetTransmissionModel[];
  imageTransmission!: string;
  modelsList: number[] = [];
  fuelsList: string[] = [
    'Gasolina',
    'Diésel (ACPM)',
    'Híbrido (Gasolina + Electrico)',
    'Electrico',
  ]; // Obtener estos datos de la db !!
  fuelName: string = '';
  colorsList: string[] = [
    'No se garantiza',
    'Negro',
    'Blanco',
    'Rojo',
    'Gris',
    'Amarillo',
    'Azul',
    'Verde',
  ];
  platesList: string[] = [
    'No se garantiza',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
  ];
  allowedPaymentMethodsList: string[] = [
    'Solo efectivo o transferencia',
    'Solo tarjeta de crédito',
    'Todos',
  ];
  valorTotal: number = 0;
  percentageInValues: number = 0;

  paymentMethodForWarranty: string[] = [];

  categories = [
    {
      label: 'Cómo quieres cotizar',
      fields: [
        {
          label: '',
          type: 'button',
          name: '',
          action: 'typeOfCalculation',
          options: { readonly: false, placeholder: '', checkboxs: [] },
        },
        {
          label: 'Valor de renta × día $',
          type: 'text',
          name: 'rent',
          action: 'formatInput',
          options: { readonly: false, placeholder: 'Ej. $250.000 (COP)', checkboxs: [] },
        },
        {
          label: 'Valor entrega a domicilio $',
          type: 'text',
          name: 'home_delivery',
          action: 'formatInput',
          options: { readonly: false, placeholder: '', checkboxs: [] },
        },
        {
          label: 'Valor recogida a domicilio $',
          type: 'text',
          name: 'home_collection',
          action: 'formatInput',
          options: { readonly: false, placeholder: '', checkboxs: [] },
        },
        {
          label: 'Valor hora/s extra/s $',
          type: 'text',
          name: 'overtime',
          action: 'formatInput',
          options: { readonly: false, placeholder: '', checkboxs: [] },
        },
        {
          label: 'Valor de recogida o devolución en distinta ciudad $',
          type: 'text',
          name: 'return_or_collection_different_city',
          action: 'formatInput',
          options: { readonly: false, placeholder: '', checkboxs: [] },
        },
        {
          label: 'Valor total: ',
          type: 'p',
          name: '',
          action: 'totalValue',
          options: { readonly: true, placeholder: '', checkboxs: [] },
        },
      ],
    },
    {
      label: 'Detalles del carro o gama',
      fields: [
        {
          label: 'Marca y referencia *',
          type: 'text',
          name: 'brand',
          action: 'showOverlay',
          options: { readonly: true, placeholder: 'Selecciona una opción', checkboxs: [] },
        },
        {
          label: 'Tipo de tranmisión *',
          type: 'text',
          name: 'transmission',
          action: 'showOverlay',
          options: { readonly: true, placeholder: 'Selecciona una opción', checkboxs: [] },
        },
        {
          label: 'Modelo del vehiculo *',
          type: 'text',
          name: 'model',
          action: 'showOverlay',
          options: { readonly: true, placeholder: 'Selecciona una opción', checkboxs: [] },
        },
        {
          label: 'Tipo de combustible',
          type: 'text',
          name: 'fuel',
          action: 'showOverlay',
          options: { readonly: true, placeholder: 'Selecciona una opción', checkboxs: [] },
        },
        {
          label: 'Color del vehículo',
          type: 'text',
          name: 'color',
          action: 'showOverlay',
          options: { readonly: true, placeholder: 'Selecciona una opción', checkboxs: [] },
        },
        {
          label: 'Placa termina en...',
          type: 'text',
          name: 'plate_end_in',
          action: 'showOverlay',
          options: { readonly: true, placeholder: 'Selecciona una opción', checkboxs: [] },
        },
      ],
    },
    {
      label: 'Condiciones de la renta',
      fields: [
        {
          label: 'Garantía $',
          type: 'text',
          name: 'value_to_block_on_credit_card',
          action: 'formatInput',
          options: { readonly: false, placeholder: '', checkboxs: [] },
        },
        {
          label: '',
          type: 'checkbox',
          name: '',
          action: 'garantia',
          options: { readonly: false, placeholder: '', checkboxs: [
              {
                label: 'En efectivo',
                type: 'checkbox',
                name: 'efectivo',
                action: 'garantia',
                options: { readonly: false, placeholder: '', checkboxs: [] }
              },
              {
                label: 'Con tarjeta de crédito',
                type: 'checkbox',
                name: 'tcredito',
                action: 'garantia',
                options: { readonly: false, placeholder: '', checkboxs: [] }
              },
           ] }
        },
        {
          label: 'Kilometraje *',
          type: 'text',
          name: 'available_kilometers',
          action: '',
          options: { readonly: false, placeholder: '', checkboxs: [] },
        },
        {
          label: 'Comisión ZiziCar: ',
          type: 'p',
          name: '',
          action: 'percentageInValues',
          options: { readonly: true, placeholder: '', checkboxs: [] },
        },
        {
          label: 'Comentarios',
          type: 'textarea',
          name: 'comments',
          action: '',
          options: { readonly: false, placeholder: '', checkboxs: [] },
        },
      ],
    },
  ];

  constructor(
    private requestService: RequestDataService,
    private transmissionService: TransmissionService,
    private quoteService: QuoteDataService,
    private communicationService: CommunicationService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    private profileService: ProfileService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.communicationService.loading.emit(true);
    this.getDataOfRequest();
    this.initializeForm();
    this.getTransmissions();
    this.getModels();
    this.scrollTo.emit(0);
  }

  getDataOfRequest() {
    if (!this.requestId) {
      this.quote.emit();
    }

    this.requestService.getRequest(this.requestId).subscribe({
      next: async (request) => {
        if (request) {
          this.profileService.getProfileWithProviderData().subscribe({
            next: async (provider) => {
              this.allowed_payment_method = provider.allowed_payment_method;
              this.formAnswer
                .get('allowed_payment_method')
                ?.setValue(provider.allowed_payment_method);
              this.formAnswer
                .get('percentage_of_total_value')
                ?.setValue(provider.percentage_of_rent + '%');
              this.percentage_of_rent = provider.percentage_of_rent;
            },
            error: (error) => {
              console.error('Error al obtener el usuario', error);
            },
          });
          this.phoneClientRequest = request.phone;

          this.dataForRequestInformation = {
            gamma: request.gamma,
            transmission: request.transmission,
            days_of_rent: request.days_of_rent,
            entry_city: request.entry_city,
            receive_at_airport: request.receive_at_airport,
            entry_date:
              this.datePipe.transform(
                request.entry_date,
                'fullDate',
                'es-ES'
              ) || '',
            entry_time: request.entry_time,
            devolution_city: request.devolution_city,
            returns_at_airport: request.returns_at_airport,
            devolution_date:
              this.datePipe.transform(
                request.devolution_date,
                'fullDate',
                'es-ES'
              ) || '',
            devolution_time: request.devolution_time,
            comments: request.comments || 'No hay comentarios',
          };

          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.communicationService.loading.emit(false);
        }
      },
      error: (error) => {
        console.error('Error al obtener la solicitud:', error);
        this.quote.emit();
        this.communicationService.loading.emit(false);
      },
    });
  }

  initializeForm() {
    this.formAnswer = this.fb.group({
      rent: ['', [Validators.required, Validators.min(10)]],
      overtime: [0, [Validators.required]],
      home_delivery: [0, [Validators.required]],
      home_collection: [0, [Validators.required]],
      return_or_collection_different_city: [0, [Validators.required]],
      brand: ['', [Validators.required]],
      transmission: ['', [Validators.required]],
      model: ['', [Validators.required]],
      color: ['No se garantiza', [Validators.required]],
      fuel: [''],
      plate_end_in: ['No se garantiza', [Validators.required]],
      value_to_block_on_credit_card: ['', [Validators.required]],
      allowed_payment_method: ['', [Validators.required]],
      available_kilometers: ['', [Validators.required]],
      percentage_of_total_value: [''],
      comments: [''],
    });
  }

  getTransmissions() {
    this.transmissionService.getTransmissions().subscribe({
      next: (transmissions) => {
        this.transmissionsList = transmissions;
      },
    });
  }

  getModels() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 2015; i--) {
      this.modelsList.push(i);
    }
  }

  showOverlay(event: Event, type: string) {
    if (type === 'brand') {
      this.overlayBrand.toggle(event);
    } else if (type === 'transmission') {
      this.overlayTransmission.toggle(event);
    } else if (type === 'model') {
      this.overlayModel.toggle(event);
    } else if (type === 'fuel') {
      this.overlayFuel.toggle(event);
    } else if (type === 'color') {
      this.overlayColor.toggle(event);
    } else if (type === 'plate_end_in') {
      this.overlayPlate.toggle(event);
    } else if (type === 'allowed_payment_method') {
      this.overlayPaymentMethod.toggle(event);
    }
  }

  setHoveredImage(type: 'transmission', imageName: string) {
    if (type === 'transmission') {
      this.imageTransmission = imageName;
    }
  }

  selectCategory(
    category: any,
    type:
      | 'transmission'
      | 'model'
      | 'fuel'
      | 'color'
      | 'plate'
      | 'paymentMethod'
      | 'brand'
  ) {
    if (type === 'transmission') {
      if (this.formAnswer.get('transmission')?.value != category) {
        this.formAnswer.get('transmission')?.setValue(category);
        this.overlayTransmission.hide();
      }
      this.overlayTransmission.hide();
    } else if (type === 'model') {
      this.formAnswer.get('model')?.setValue(category);
      this.overlayModel.hide();
    } else if (type === 'fuel') {
      if (this.formAnswer.get('fuel')?.value != category) {
        this.formAnswer.get('fuel')?.setValue(category);
        this.overlayTransmission.hide();
      }
      this.overlayFuel.hide();
    } else if (type === 'color') {
      this.formAnswer.get('color')?.setValue(category);
      this.overlayColor.hide();
    } else if (type === 'plate') {
      this.formAnswer.get('plate_end_in')?.setValue(category.toString());
      this.overlayPlate.hide();
    } else if (type === 'paymentMethod') {
      this.formAnswer.get('allowed_payment_method')?.setValue(category);
      this.overlayPaymentMethod.hide();
    } else if (type === 'brand') {
      this.formAnswer.get('brand')?.setValue(category);
      this.overlayBrand.hide();
    }

    this.cdr.detectChanges();
  }

  onCheckboxChange(type: string, text: string, event: any) {
    const acceptedType = ['warranty'];

    if (!acceptedType.includes(type)) {
      console.error('type not accepted.', type);
      return;
    }

    if (type === 'warranty') {
      if (event.checked.length > 0) {
        if (!this.paymentMethodForWarranty.includes(text)) {
          this.paymentMethodForWarranty.push(text);
        }
      } else {
        this.paymentMethodForWarranty = this.paymentMethodForWarranty.filter(item => item !== text);
      }
    }
  }

  ngAfterViewInit() {
    this.updateOverlayWidth();
  }

  @HostListener('window:resize', ['$event'])
  checkScreen() {
    const width = window.innerWidth;
    this.isMobile = width <= 640;

    return this.isMobile;
  }

  updateOverlayWidth() {
    if (this.transmissionContainer) {
      const containerWidth =
        this.transmissionContainer.nativeElement.offsetWidth;
      this.overlayWidth = `${containerWidth}px`;
      this.cdr.detectChanges();
    }
  }

  formatInput(controlName: string, event: any): void {
    const input = event.target.value.replace(/\D/g, '');
    const numericValue = parseFloat(input) || 0;

    if (controlName === 'rentPerDay') {
      const value =
        numericValue * (this.dataForRequestInformation.days_of_rent || 0);
      this.totalValueOfRentPerDay = value;
      this.formAnswer.get('rent')?.setValue(value);
    } else {
      this.formAnswer.get(controlName)?.setValue(numericValue);
    }

    event.target.value = this.formatCurrency(numericValue);

    this.getTotalValue();
  }

  toggleTypeOfCalculation() {
    this.valuePerDay = !this.valuePerDay;
    this.formAnswer.get('rent')?.reset();
    this.totalValueOfRentPerDay = 0;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  getTotalValue() {
    this.valorTotal =
      (this.formAnswer.get('rent')?.value || 0) +
      (this.formAnswer.get('home_delivery')?.value || 0) +
      (this.formAnswer.get('home_collection')?.value || 0) +
      (this.formAnswer.get('overtime')?.value || 0) +
      (this.formAnswer.get('return_or_collection_different_city')?.value || 0);
    this.percentageInValues = this.formatPercentage();
  }

  formatPercentage() {
    return this.formAnswer.get('rent')?.value * (this.percentage_of_rent / 100);
  }

  get totalPages(): number {
    return this.categories.length;
  }

  get currentCategory() {
    return this.categories[this.currentPage - 1];
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cdr.detectChanges();
    }
  }

  nextPage() {
    if (this.currentPage === 1) {
      if (
        this.formAnswer.get('rent')?.invalid ||
        this.formAnswer.get('allowed_payment_method')?.invalid
      ) {
        this.formAnswer.get('rent')?.markAsTouched();
      } else {
        this.currentPage++;
        this.cdr.detectChanges();
        if (this.isMobile) {
          this.scrollTo.emit(100);
        } else {
          this.scrollTo.emit(0);
        }
      }
    } else if (this.currentPage === 2) {
      if (
        this.formAnswer.get('brand')?.invalid ||
        this.formAnswer.get('transmission')?.invalid ||
        this.formAnswer.get('model')?.invalid
      ) {
        this.formAnswer.get('brand')?.markAsTouched();
        this.formAnswer.get('transmission')?.markAsTouched();
        this.formAnswer.get('model')?.markAsTouched();
      } else {
        this.currentPage++;
        if (this.isMobile) {
          this.scrollTo.emit(100);
        } else {
          this.scrollTo.emit(0);
        }
        this.cdr.detectChanges();
      }
    }
  }

  createQuote() {
    if(this.paymentMethodForWarranty.length === 0){
      this.paymentMethodRequired = true;
      if(this.isMobile){
        this.scrollTo.emit(100);
      }else{
        this.scrollTo.emit(0);
      }
      return;
    }

    this.paymentMethodRequired = false;

    if (this.formAnswer.valid) {
      const formValues = { ...this.formAnswer.value };

      formValues.comments = formValues.comments?.trim() || 'No hay comentarios';

      this.communicationService.loading.emit(true);

      this.profileService.getProfileWithProviderData().subscribe({
        next: (provider) => {
          const quote: PostQuoteInterface = {
            ...formValues,
            percentage_in_values: this.percentageInValues,
            total_value: this.valorTotal,
            phone_client: this.phoneClientRequest,
            paymentMethodForWarranty: this.paymentMethodForWarranty.length > 0 ? this.paymentMethodForWarranty : ['No especificado'],
            request_id: this.requestId,
            renter_id: provider.id,
          };

          console.log(quote);

          this.quoteService.createQuote(quote).subscribe({
            next: (response) => {
              console.log('Se ha enviado la respuesta con éxito');
            },
            error: (error) => {
              console.error('Error al crear la cotización:', error);
              this.quote.emit();
              this.communicationService.loading.emit(false);
            },
            complete: () => {
              this.quote.emit();
              this.communicationService.loading.emit(false);
            },
          });
        },
        error: (error) => {
          console.error('Error al obtener al proveedor:', error);
          this.communicationService.loading.emit(false);
        },
      });
    } else {
      this.formAnswer.markAllAsTouched();
    }
  }
}
