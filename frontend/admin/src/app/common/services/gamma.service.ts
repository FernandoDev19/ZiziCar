import { Injectable } from '@angular/core';
import { DataCommonService } from './data-common.service';

@Injectable({
  providedIn: 'root'
})
export class GammaService {

  constructor(private commonService: DataCommonService) { }

  getGamma(id: string){
    return this.commonService.getGamma(id);
  }
}
