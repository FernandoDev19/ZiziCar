import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit, output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ProviderDataForTablesInterface } from '../../../../../providers/interfaces/provider-data-for-table.interface';
import { CommunicationService } from '../../../../../../common/services/communication.service';
import { RequestDataService } from '../../../../services/request-data.service';
import { firstValueFrom } from 'rxjs';
import { GeolocationService } from '../../../../../../common/services/geolocation.service';

@Component({
  selector: 'app-provider-data',
  standalone: true,
  imports: [
    CommonModule,
    TableModule
  ],
  templateUrl: './provider-data.component.html',
  styleUrl: './provider-data.component.css',
  providers: [DatePipe]
})
export class ProviderDataComponent implements OnInit {
  providerData!: ProviderDataForTablesInterface[];
  @Input() requestId!: string;
   toggleModalEmitter = output<string>();
   isSentToDataLoaded = output<boolean>();
   showActions = output<boolean>();

   private countryCache = new Map<number, string>();
   private stateCache = new Map<number, string>();
   private cityCache = new Map<number, string>();

   constructor(
    private globalCommunication: CommunicationService,
    private requestService: RequestDataService,
    private geolocationService: GeolocationService,
    private datePipe: DatePipe
    ){}

    ngOnInit(): void {
        this.getSentTo(this.requestId);
    }

  toggleModal(type: string){
    this.toggleModalEmitter.emit(type);
  }

  getSentTo(id: string) {
    this.globalCommunication.loading.emit(true);
    this.requestService.getRequestsSent(id).subscribe({
      next: async (providers) => {
        if (providers.length > 0) {
          try {
            const providersWithDetails = await Promise.all(
              providers.map(async (provider) => {
                const country =
                  (await this.getCountry(provider.country_id)) ||
                  'Country not found';
                const state =
                  (await this.getState(provider.state_id)) || 'State not found';
                const city =
                  (await this.getCity(provider.city_id)) || 'City not found';
                const citiesPreferencesArray: number[] =
                  provider.cities_preferences
                    ? JSON.parse(provider.cities_preferences)
                    : [];

                const cities_preferences = await Promise.all(
                  citiesPreferencesArray.map(async (preference) => {
                    return this.getCity(preference);
                  })
                );

                return {
                  id: provider.id,
                  name: provider.name,
                  nit: provider.nit,
                  phone: provider.phone,
                  email: provider.email,
                  country: country,
                  state: state,
                  city: city,
                  address: provider.address,
                  cities_preferences: cities_preferences,
                  percentage_of_rent:
                    provider.percentage_of_rent.toString() + '%',
                  allowed_payment_method: provider.allowed_payment_method,
                  created_at_unformatted: provider.created_at,
                  created_at:
                    this.datePipe.transform(
                      provider.created_at,
                      'fullDate',
                      'es-ES'
                    ) || '',
                };
              })
            );

            this.providerData = providersWithDetails;
            this.isSentToDataLoaded.emit(true);
          } catch (error) {
            console.error('Error while  processing providers');
          } finally {
            this.globalCommunication.loading.emit(false);
          }
        } else {
          alert('Esta solicitud no se envio a nadie');
        }
        this.showActions.emit(false);
      },
      error: (error) => {
        alert('Esta solicitud no se envio a nadie');
        console.error('Error al obtener los datos.', error);
        this.isSentToDataLoaded.emit(false);
        this.globalCommunication.loading.emit(false);
      },
    });
  }

  async getCountry(id: number): Promise<string> {
    if (this.countryCache.has(id)) {
      return this.countryCache.get(id)!;
    }
    try {
      const country = await firstValueFrom(
        this.geolocationService.getCountry(id)
      );
      this.countryCache.set(id, country.name);
      return country.name;
    } catch {
      return 'Error al obtener el pais';
    }
  }

  async getState(id: number): Promise<string> {
    if (this.stateCache.has(id)) {
      return this.stateCache.get(id)!;
    }
    try {
      const state = await firstValueFrom(this.geolocationService.getState(id));
      this.stateCache.set(id, state.name);
      return state.name;
    } catch {
      return 'Error al obtener el estado';
    }
  }

  async getCity(id: number): Promise<string> {
    if (this.cityCache.has(id)) {
      return this.cityCache.get(id)!;
    }
    try {
      const city = await firstValueFrom(
        this.geolocationService.getGlobalCity(id)
      );
      this.cityCache.set(id, city.name);
      return city.name;
    } catch {
      return 'Error al obtener la ciudad';
    }
  }
}
