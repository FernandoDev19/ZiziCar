import { Injectable } from '@angular/core';
import { DataCommonService } from './data-common.service';

@Injectable({
  providedIn: 'root'
})
export class TransmissionService {

  constructor(private commonService: DataCommonService) { }

  getTransmission(id: string){
    return this.commonService.getTransmission(id);
  }

  getTransmissions(){
    return this.commonService.getTransmissions();
  }
}
