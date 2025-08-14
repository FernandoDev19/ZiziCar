import { Injectable } from '@angular/core';
import { DataCommonService } from '../../../common/services/data-common.service';
import { ReservationConfirmationModel } from '../interfaces/reservation-confirmation.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestDataService {

  constructor(private dataCommon: DataCommonService) { }

  getRequests(){
    return this.dataCommon.getRequests();
  }

  getRequestsForProviders(){
    return this.dataCommon.getRequestsForProviders();
  }

  getRequest(id: string){
    return this.dataCommon.getRequest(id);
  }

  countRequests(condition: string){
    return this.dataCommon.countRequests(condition);
  }

  sendReservationConfirmation(data: ReservationConfirmationModel){
    return this.dataCommon.sendReservationConfirmation(data);
  }

  deleteRequest(id: string){
    return this.dataCommon.deleteRequest(id);
  }

  getRequestProviderRelation(requestId: string, providerId: string){
    return this.dataCommon.getRequestProviderRelations(requestId, providerId);
  }

  getRequestsSent(requestId: string){
    return this.dataCommon.getRequestsSent(requestId);
  }

}
