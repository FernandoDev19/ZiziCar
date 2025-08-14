import { Injectable } from '@angular/core';
import { DataCommonService } from './data-common.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private dataCommon: DataCommonService) { }

  getProfile(){
    return this.dataCommon.getProfile();
  }

  getProfileWithProviderData(){
    return this.dataCommon.getProfileWithProviderData();
  }
}
