import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ProviderDataService } from '../../services/provider-data.service';
import { CommunicationService } from '../../../../common/services/communication.service';
import { firstValueFrom } from 'rxjs';
import { GeolocationService } from '../../../../common/services/geolocation.service';
import { DatePipe } from '@angular/common';
import { ProviderDataForTablesInterface } from '../../interfaces/provider-data-for-table.interface';

@Component({
  selector: 'app-providers-list',
  standalone: true,
  imports: [TableModule],
  templateUrl: './providers-list.component.html',
  styleUrl: './providers-list.component.css',
  providers: [DatePipe],
})
export class ProvidersListComponent implements OnInit {
  providers!: ProviderDataForTablesInterface[];

  private countryCache = new Map<number, string>();
  private stateCache = new Map<number, string>();
  private cityCache = new Map<number, string>();

  constructor(
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    private geolocationService: GeolocationService,
    private providerService: ProviderDataService,
    private communicationService: CommunicationService
  ) {}

  ngOnInit(): void {
    this.getProviders();
  }

  onSearch(event: Event, dtRequests: any): void {
    const input = event.target as HTMLInputElement;
    const value = input?.value || '';
    dtRequests.filterGlobal(value, 'contains');
  }

  get globalFields() {
    const fieldsForAdmin = [
      'name',
      'nit',
      'phone',
      'email',
      'country',
      'state',
      'city',
      'address',
      'cities_preferences',
      'percentage_of_rent',
      'allowed_payment_method',
      'created_at'
    ];
    return fieldsForAdmin;
  }

  getProviders() {
    this.communicationService.loading.emit(true);

    this.providerService.getProviders().subscribe({
      next: async (providers) => {
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

          this.providers = providersWithDetails;
          this.cdr.detectChanges();
        } catch (error) {
          console.error('Error while processing providers:', error);
        } finally {
          this.communicationService.loading.emit(false);
        }
      },
      error: (err) => {
        console.error('Error fetching providers:', err);
        this.communicationService.loading.emit(false);
      },
    });
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
}
