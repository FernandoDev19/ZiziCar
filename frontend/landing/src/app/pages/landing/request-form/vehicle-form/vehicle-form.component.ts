import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Popover, PopoverModule } from 'primeng/popover';
import { GammaService } from '../../../../common/services/gamma.service';
import { CommunicationService } from '../../../../common/services/communication.service';
import {
  GetTransmissionInterface,
} from '../../../../common/interfaces/transmission.interface';
import { ListboxModule } from 'primeng/listbox';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TransmissionService } from '../../../../common/services/transmission.service';
import { GeolocationService } from '../../../../common/services/geolocation.service';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faSearch, faClock, faCar } from '@fortawesome/free-solid-svg-icons';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DatePickerModule } from 'primeng/datepicker';
import { GetGammaInterface } from '../../../../common/interfaces/gamma.interface';

@Component({
  selector: 'app-vehicle-form',
  imports: [CommonModule, PopoverModule, ReactiveFormsModule, ListboxModule, FontAwesomeModule, ToggleSwitchModule, DatePickerModule],
  templateUrl: './vehicle-form.component.html',
  standalone: true,
  styleUrl: './vehicle-form.component.css',
})
export class VehicleFormComponent implements OnInit, AfterViewInit {
  vehicleForm!: FormGroup;
  today = new Date();
  es: any;
  minDevolutionDate: Date | null = null;
  times = [
    '12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM',
    '3:00 AM', '3:30 AM', '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM',
    '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM',
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    'Mediodía', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
    '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
  ];
  scrollToBottom: number = 100;

  // Popovers
  @ViewChild('popoverGamma') popoverGamma!: Popover;
  @ViewChild('popoverTransmission') popoverTransmission!: Popover;
  @ViewChild('popoverEntryCity') popoverEntryCity!: Popover;
  @ViewChild('popoverDevolutionCity') popoverDevolutionCity!: Popover;
  @ViewChild('popoverEntryDate') popoverEntryDate!: Popover;
  @ViewChild('popoverDevolutionDate') popoverDevolutionDate!: Popover;
  @ViewChild('popoverEntryTime') popoverEntryTime!: Popover;
  @ViewChild('popoverDevolutionTime') popoverDevolutionTime!: Popover;

  @ViewChild('vehicleTypeContainer') vehicleTypeContainer!: ElementRef;

  // Icons
  faSearch: IconDefinition = faSearch;
  faClock: IconDefinition = faClock;
  faCar: IconDefinition = faCar;

  overlayWidth: string = '300px';
  isMobile: boolean = false;

  gammas!: GetGammaInterface[];
  transmissions!: GetTransmissionInterface[];
  countries: { name: string; cities: { city_id: number; city_name: string }[] }[] = [];
  filteredCountries: { name: string; cities: { city_id: number; city_name: string }[] }[] = [];
  averagePricesForSelect!: {gammaId: string; averagePrice: number}[];

  //Options selected
  gammaSelected: {
    name: string;
    image: string;
    average_price: number;
  } = {
    name: '',
    image: '',
    average_price: 0,
  };

  transmissionSelected: {
    name: string;
    image: string;
  } = {
    name: '',
    image: '',
  };

  entryCitySelected!: string;
  devolutionCitySelected: string = '';
  entryDateSelected!: string;
  devolutionDateSelected!: string;

  @Output() next = new EventEmitter<boolean>();

  constructor(
    private cdr: ChangeDetectorRef,
    private gammaService: GammaService,
    private transmissionService: TransmissionService,
    private communicationService: CommunicationService,
    private geolocationService: GeolocationService,
    private fb: FormBuilder
  ) {
    this.es = {
      firstDayOfWeek: 1,
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      monthNames: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ],
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      today: 'Hoy',
      clear: 'Limpiar',
      dateFormat: 'dd/mm/yy',
      weekHeader: 'Sem',
    };
  }

  ngOnInit(): void {
    this.getAveragesPrices();
    this.formInit();
    this.getData();
    this.checkScreen();
  }

  ngAfterViewInit(): void {
    this.updateOverlayWidth();
  }

  formInit() {
    this.vehicleForm = this.fb.group({
      id_entry_city: ['', [Validators.required]],
      id_devolution_city: ['', [Validators.required]],
      gamma_id: ['', [Validators.required]],
      transmission_id: ['', [Validators.required]],
      receive_at_airport: [false],
      returns_at_airport: [false],
      entry_date: ['', [Validators.required]],
      entry_time: ['', [Validators.required]],
      devolution_date: ['', [Validators.required]],
      devolution_time: ['', [Validators.required]]
    });
  }

  togglePopover(type: string, event: Event) {
    if (type === 'gamma') {
      this.popoverGamma.toggle(event);
    } else if (type === 'transmission') {
      this.popoverTransmission.toggle(event);
    } else if (type === 'entryCity') {
      this.popoverEntryCity.toggle(event);
    } else if (type === 'devolutionCity') {
      this.popoverDevolutionCity.toggle(event);
    } else if (type === 'entryDate') {
      this.popoverEntryDate.toggle(event);
    } else if (type === 'devolutionDate') {
      this.popoverDevolutionDate.toggle(event);
    } else if (type === 'entryTime') {
      this.popoverEntryTime.toggle(event);
    } else if (type === 'devolutionTime') {
      this.popoverDevolutionTime.toggle(event);
    } else {
      console.error('Incorrect type: ', type);
    }
  }

  selectOptionOfPopover(type: string, option: any) {
    if (type === 'gamma') {
      const getGammaSelectedNow = this.gammas.find(
        (gamma) => gamma.id === option
      );

      if (getGammaSelectedNow?.name != this.gammaSelected.name) {
        this.vehicleForm.get('gamma_id')?.setValue(getGammaSelectedNow?.id);
        this.gammaSelected = {
          name: getGammaSelectedNow?.name || 'Error',
          image: getGammaSelectedNow?.image_url || '',
          average_price: this.getAveragePriceForGamma(getGammaSelectedNow?.id || '') || 0,
        };
        this.communicationService.dataForResume.emit({
          gamma: {
            name: this.gammaSelected.name,
            image: this.gammaSelected.image,
            average_price: this.getAveragePriceForGamma(getGammaSelectedNow?.id || '') || 0
          }
        });
        this.popoverGamma.hide();

        this.scrollToBottomFunction();
      } else {
        this.popoverGamma.hide();
      }
    } else if (type === 'transmission') {
      const transmissionSelectedNow = this.transmissions.find(
        (transmission) => transmission.id === option
      );

      if (transmissionSelectedNow?.name != this.transmissionSelected.name) {
        this.vehicleForm
          .get('transmission_id')
          ?.setValue(transmissionSelectedNow?.id);
        this.transmissionSelected = {
          name: transmissionSelectedNow?.name || 'Error',
          image: transmissionSelectedNow?.image_url || '',
        };
        this.popoverTransmission.hide();

        this.scrollToBottomFunction();
      } else {
        this.popoverTransmission.hide();
      }
    }else if(type === 'entryCity'){
      const cities = this.countries.flatMap(country => country.cities);
      const entryCitySelectedNow = cities.find(city => city.city_id === option);

      if(entryCitySelectedNow?.city_name != this.entryCitySelected){
        this.entryCitySelected = entryCitySelectedNow?.city_name || 'Error';
        this.vehicleForm.get('id_entry_city')?.setValue(entryCitySelectedNow?.city_id);

        if(entryCitySelectedNow?.city_name != this.devolutionCitySelected){
          this.devolutionCitySelected = entryCitySelectedNow?.city_name || 'Error';
          this.vehicleForm.get('id_devolution_city')?.setValue(entryCitySelectedNow?.city_id);
        }

        this.popoverEntryCity.hide();

        this.scrollToBottomFunction(20);
      }else{
        this.popoverEntryCity.hide();
      }
    }else if(type === 'devolutionCity'){
      const cities = this.countries.flatMap(country => country.cities);
      const devolutionCitySelectedNow = cities.find(city => city.city_id === option);

      if(devolutionCitySelectedNow?.city_name != this.entryCitySelected){
        this.communicationService.message.emit('Para devoluciones en ciudades distintas a la recogida, aplican recargos. Estos se reflejarán en tu cotización.');
      }

      if(devolutionCitySelectedNow?.city_name != this.devolutionCitySelected){
        this.vehicleForm.get('id_devolution_city')?.setValue(devolutionCitySelectedNow?.city_id);
        this.devolutionCitySelected = devolutionCitySelectedNow?.city_name || 'Error';
        this.popoverDevolutionCity.hide();

        this.scrollToBottomFunction(20);
      }else{
        this.popoverDevolutionCity.hide();
      }
    } else  if (type === 'entryDate') {
      this.popoverEntryDate.hide();
      const dateFormatted = new Date(option).toLocaleString('es-ES', {
        formatMatcher: 'best fit',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      if(this.entryDateSelected != dateFormatted){
        this.entryDateSelected = dateFormatted;
        this.vehicleForm.get('entry_date')?.setValue(option);
        this.vehicleForm.get('devolution_date')?.setValue('');
      }

      this.scrollToBottomFunction(20);
    } else if (type === 'devolutionDate') {
      this.popoverDevolutionDate.hide();
      const dateFormatted = new Date(option).toLocaleString('es-ES', {
        formatMatcher: 'best fit',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      if(this.devolutionDateSelected != dateFormatted){
        this.devolutionDateSelected = dateFormatted;
        this.vehicleForm.get('devolution_date')?.setValue(option);
      }

      this.scrollToBottomFunction(20);
    } else if (type === 'entryTime') {
      this.vehicleForm.get('entry_time')?.setValue(option.value);
      this.vehicleForm.get('devolution_time')?.setValue(option.value);
      this.popoverEntryTime.hide();

      this.scrollToBottomFunction();
    } else if (type === 'devolutionTime') {
      this.vehicleForm.get('devolution_time')?.setValue(option.value);
      this.popoverDevolutionTime.hide();

      this.scrollToBottomFunction(20);
    } else {
      console.error('Incorrect type: ', type);
    }
  }

  changeImage(type: string, option: any) {
    if (type === 'gamma') {
      const getGammaSelectedNow = this.gammas.find(
        (gamma) => gamma.id === option
      );
      this.gammaSelected.image = getGammaSelectedNow?.image_url || '';
      this.gammaSelected.average_price = this.getAveragePriceForGamma(getGammaSelectedNow?.id || '') || 0;
    } else if (type === 'transmission') {
      const getTransmissionSelectedNow = this.transmissions.find(
        (transmission) => transmission.id === option
      );
      this.transmissionSelected.image =
        getTransmissionSelectedNow?.image_url || '';
    } else {
      console.error('Incorrect type: ', type);
    }
  }

  @HostListener('window:resize', ['$event'])
  checkScreen() {
    const width = window.innerWidth;
    const isMobile = width <= 640;

    if (this.isMobile !== isMobile) {
      this.isMobile = isMobile;
      this.cdr.detectChanges();
    }

    return this.isMobile;
  }

  updateOverlayWidth() {
    if (this.vehicleTypeContainer) {
      const containerWidth = this.vehicleTypeContainer.nativeElement.offsetWidth;
      this.overlayWidth = `${containerWidth}px`;
      this.cdr.detectChanges();
    }
  }

  scrollToBottomFunction(n: number = 0) {
    if (this.scrollToBottom < 680 && this.isMobile) {
      const increment = 7;
      const scrollTarget = this.scrollToBottom + 90 + n;

      const step = () => {
        if (this.scrollToBottom < scrollTarget) {
          window.scrollBy(0, increment);
          this.scrollToBottom += increment;
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    }
  }

  addOneDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  }

  getData() {
    this.vehicleForm.get('entry_date')?.valueChanges.subscribe((value) => {
      this.minDevolutionDate = value ? this.addOneDay(value) : null;
    });
    this.getGammas();
  }

  getGammas() {
    this.gammaService.getGammas().subscribe({
      next: (gammas) => {
        this.gammas = gammas.sort((a, b) => a.precio_promedio - b.precio_promedio);
        this.communicationService.gammas.emit(gammas);
        this.getTransmissions();
      },
      error: (e) => {
        console.error('Error al obtener las gamas.', e);
      },
    });
  }

  getAveragesPrices(){
    
    this.gammaService.getAveragePrices().subscribe({
      next: price => {
        this.averagePricesForSelect = price;
        this.getGammas();
      },
      error: e => {
        console.error('Ha ocurrido un error al obtener los precios promedios');
      }
    });
  }

  getAveragePriceForGamma(gammaId: string) {
    const gammaPrice = this.averagePricesForSelect.find(price => price.gammaId === gammaId);
    return gammaPrice ? gammaPrice?.averagePrice : 0;
  }

  getTransmissions() {
    this.transmissionService.getTransmissions().subscribe({
      next: (transmissions) => {
        this.transmissions = transmissions;

        this.getGeolocations();
      },
      error: (e) => {
        console.error('Error al obtener las transmisiones.', e);
      },
    });
  }

  getGeolocations() {
    this.geolocationService.getGeolocations().subscribe({
      next: (data) => {
        this.countries = data.flatMap((continent) =>
          continent.countries.map((country) => ({
            name: country.country_name,
            cities: country.states.flatMap((state) =>
              state.cities.map((city) => ({ city_id: city.city_id, city_name: city.city_name }))
            ),
          }))
        );
        this.filteredCountries = [...this.countries];

      },
      error: (e) => {
        console.error(
          'Error al obtener las ciudades, los estados, los paises y continentes.',
          e
        );
      },
    });
  }

  filterCountries(event: Event): void {
    let searchQuery = (<HTMLInputElement>event.target).value;
    this.filteredCountries = this.countries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.cities.some((city) =>
          city.city_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }

  continue(){
    if(this.vehicleForm.valid){
      this.communicationService.dataForResume.emit({
        gamma: {
          name: this.gammaSelected.name,
          image: this.gammaSelected.image,
          average_price: this.gammaSelected.average_price
        },
        transmission: {
          name: this.transmissionSelected.name
        },
        entry: {
          city: this.entryCitySelected,
          dateTime: this.entryDateSelected + ' ' + this.vehicleForm.get('entry_time')?.value,
          receive_at_airport: this.vehicleForm.get('receive_at_airport')?.value
        },
        devolution: {
          city: this.devolutionCitySelected,
          dateTime: this.devolutionDateSelected + ' ' + this.vehicleForm.get('devolution_time')?.value,
          returns_at_airport: this.vehicleForm.get('returns_at_airport')?.value
        }
      });
      this.next.emit(true);
    }else{
      this.communicationService.message.emit('Faltan datos para poder continuar');
    }
  }
}
