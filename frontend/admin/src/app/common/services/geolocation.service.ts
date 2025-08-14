import { Injectable } from '@angular/core';
import { DataCommonService } from './data-common.service';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private dataCommonService: DataCommonService) { }

  getCountry(id: number){
    return this.dataCommonService.getCountry(id);
  }

  getCountries(){
    return this.dataCommonService.getCountries();
  }

  getGlobalCity(id: number){
    return this.dataCommonService.getGlobalCity(id);
  }

  getGlobalCities(){
    return this.dataCommonService.getGlobalCities();
  }

  getGlobalCitiesByState(stateId: number){
    return this.dataCommonService.getGlobalCitiesByState(stateId);
  }

  getState(id: number){
    return this.dataCommonService.getState(id);
  }

  getStates(){
    return this.dataCommonService.getStates();
  }

  getStatesByCountry(countryId: number){
    return this.dataCommonService.getStatesByCountry(countryId);
  }
}


