import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCity, faCreditCard, faGlobeAmericas, faIdCard, faMap, faMapMarkedAlt, faPhone } from '@fortawesome/free-solid-svg-icons';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { GeolocationService } from '../../../../../common/services/geolocation.service';
import { GetCityInterface, GetCountryInterface, GetStateInterface } from '../../../../../common/interfaces/geolocation.interface';
import { CommunicationService } from '../../../../../common/services/communication.service';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-provider-form',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    OverlayPanelModule,
    ReactiveFormsModule,
    MultiSelectModule
  ],
  templateUrl: './provider-form.component.html',
  styleUrl: './provider-form.component.css',
})
export class ProviderFormComponent implements OnInit {
  //Iconos
  faIdCard: IconDefinition = faIdCard;
  faPhone: IconDefinition = faPhone;
  faCreditCard: IconDefinition = faCreditCard;
  faMapMarkedAlt: IconDefinition = faMapMarkedAlt;
  faGlobe: IconDefinition = faGlobeAmericas;
  faMap: IconDefinition = faMap;
  faCity: IconDefinition = faCity;

  overlayWidth: string = '450px';
  overlayMaxHeight: string = '300px';
  valueForPercentage: string = '0%';

  providerForm!: FormGroup;

  @ViewChild('nitContainer') nitContainer!: ElementRef;

  allowedPaymentMethodsList: string[] = [
    'Solo efectivo o transferencia',
    'Solo tarjeta de crédito',
    'Todos',
  ]; // Obtener de la base de datos ??
  countries!: GetCountryInterface[];
  states: GetStateInterface[] = [];
  cities: GetCityInterface[] = [];
  allCities: GetCityInterface[] = [];

  countrySelected: string = '';
  stateSelected: string = '';
  citySelected: string = '';

  //Oberlays
  @ViewChild('overlayPaymentMethod') overlayPaymentMethod!: OverlayPanel;
  @ViewChild('overlayCountry') overlayCountry!: OverlayPanel;
  @ViewChild('overlayState') overlayState!: OverlayPanel;
  @ViewChild('overlayCity') overlayCity!: OverlayPanel;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private geolocationService: GeolocationService, private communicationService: CommunicationService) {
    this.providerForm = this.fb.group({
      nit: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^[0-9-]+$'),
          Validators.maxLength(16),
        ],
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.minLength(8),
          Validators.maxLength(11),
        ],
      ],
      country_id: ['', [
        Validators.required,
        Validators.maxLength(30)
      ]],
      state_id: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
      city_id: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
      address: ['', [Validators.required, Validators.maxLength(50)]],
      cities_preferences: [[], [Validators.required]],
      percentage_of_rent: [0],
      allowed_payment_method: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.updateOverlayWidth();
    this.getCountries();
    this.getAllCities();
  }

  showOverlay(event: Event, type: 'paymentMethod' | 'country' | 'state' | 'city') {
    if (type === 'paymentMethod') {
      this.overlayPaymentMethod.toggle(event);
    }else if(type === 'country'){
      this.overlayCountry.toggle(event);
    }else if(type === 'state'){
      if(this.providerForm.get('country_id')?.value){
        this.overlayState.toggle(event);
      }else{
        this.providerForm.get('country_id')?.markAsTouched();
      }
    }else if(type === 'city'){
      if(this.providerForm.get('state_id')?.value != ''){
        this.overlayCity.toggle(event);
      }else{
        this.providerForm.get('state_id')?.markAsTouched();
      }
    }
  }

  getCountries(){
    this.communicationService.loading.emit(true);
    this.geolocationService.getCountries().subscribe({
      next: countries => {
        if(countries){
          this.countries = countries;
        }
      },
      error: error => {
        console.error('Error al obtener los paises.', error);
        this.communicationService.loading.emit(false);
      },
      complete: () => {
        this.communicationService.loading.emit(false);
      }
    });
  }

  getStatesByCountry(countryId: number){
    this.communicationService.loading.emit(true);
    this.geolocationService.getStatesByCountry(countryId).subscribe({
      next: states => {
        if(states){
          this.states = states;
        }
      },
      error: error => {
        console.error('Error al obtener los departamentos/estados.', error);
        this.communicationService.loading.emit(false);
      },
      complete: () => {
        this.communicationService.loading.emit(false);
      }
    });

  }

  getCitiesByState(stateId: number){
    this.communicationService.loading.emit(true);
    this.geolocationService.getGlobalCitiesByState(stateId).subscribe({
      next: cities => {
        if(cities){
          this.cities = cities;
        }
      },
      error: error => {
        console.error('Error al obtener las ciudades.', error);
        this.communicationService.loading.emit(false);
      },
      complete: () => {
        this.communicationService.loading.emit(false);
      }
    });
  }

  getAllCities(){
    this.communicationService.loading.emit(true);
    this.geolocationService.getGlobalCities().subscribe({
      next: cities => {
        if(cities){
          this.allCities = cities;
        }
      },
      error: error => {
        console.error('Error al obtener las ciudades.', error);
        this.communicationService.loading.emit(false);
      },
      complete: () => {
        this.communicationService.loading.emit(false);
      }
    });
  }

  selectCategory(category: any, type: 'paymentMethod' | 'country' | 'state' | 'city') {
    if (type === 'paymentMethod') {
      this.providerForm.get('allowed_payment_method')?.setValue(category);
      this.overlayPaymentMethod.hide();
    }else if(type === 'country'){
      if(this.providerForm.get('country_id')?.value === category){
        this.overlayCountry.hide();
      }else{
        this.providerForm.get('country_id')?.setValue(category);
        this.countrySelected = this.countries.find(country => country.id === category)?.name || 'Country not found';
        this.getStatesByCountry(category);
        this.overlayCountry.hide();
      }

    }else if(type === 'state'){
      if(this.providerForm.get('state_id')?.value === category){
        this.overlayState.hide();
      }else{
        this.providerForm.get('state_id')?.setValue(category);
        this.stateSelected = this.states.find(state => state.id === category)?.name || 'State not found';
        this.getCitiesByState(category);
        this.overlayState.hide();
      }

    }else if(type === 'city'){
      if(this.providerForm.get('city_id')?.value === category){
        this.overlayCity.hide();
      }else{
        this.providerForm.get('city_id')?.setValue(category);
        this.citySelected = this.cities.find(city => city.id === category)?.name || 'City not found';
        this.overlayCity.hide();
      }
    }

    this.cdr.detectChanges();
  }

  formatPercentage(event: any): void {
    const inputValue = event.target.value.replace(/[^0-9]/g, '');
    let numericValue = parseFloat(inputValue);

    if (inputValue === '') {
      numericValue = 0;
      this.providerForm.get('percentage_of_rent')?.setValue(numericValue);
      this.valueForPercentage = numericValue + '%';
    } else if (numericValue > 100) {
      numericValue = 100;
      this.providerForm.get('percentage_of_rent')?.setValue(numericValue);
      this.valueForPercentage = numericValue + '%';
    } else {
      this.providerForm.get('percentage_of_rent')?.setValue(numericValue);
      this.valueForPercentage = numericValue + '%';
    }
  }

  updateOverlayWidth() {
    if (this.nitContainer) {
      const containerWidth = this.nitContainer.nativeElement.offsetWidth;
      this.overlayWidth = `${containerWidth}px`;
      this.cdr.detectChanges();
    }
  }
}
