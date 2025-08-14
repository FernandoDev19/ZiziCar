import { Injectable } from '@angular/core';
import { DataCommonService } from './data-common.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private dataCommon: DataCommonService) { }

  isAdmin(){
    return this.dataCommon.isAdmin();
  }

  isProvider(){
    return this.dataCommon.isProvider();
  }
}
