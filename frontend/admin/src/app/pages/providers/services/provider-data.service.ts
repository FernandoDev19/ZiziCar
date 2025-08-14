import { Injectable } from '@angular/core';
import { DataCommonService } from '../../../common/services/data-common.service';
import { CreateProviderInterface } from '../interfaces/provider.interface';

@Injectable({
  providedIn: 'root'
})
export class ProviderDataService {

  constructor(private dataCommon: DataCommonService) { }

  createProvider(providerData: CreateProviderInterface){
    return this.dataCommon.createProvider(providerData);
  }

  deleteProvider(id: string){
    return this.dataCommon.deleteProviderWithId(id);
  }

  getProviderWithId(id: string){
    return this.dataCommon.getProviderWithId(id);
  }

  getProviderWithNit(nit: string){
    return this.dataCommon.getProviderWithNit(nit);
  }

  getProviders(){
    return this.dataCommon.getProviders();
  }

  getRequestProviderRelation(requestId: string, providerId: string){
    return this.dataCommon.getRequestProviderRelations(requestId, providerId);
  }

}
