import { Injectable } from '@angular/core';
import { LoginInterface } from '../interfaces/login.interface';
import { DataCommonService } from '../../../../common/services/data-common.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private dataService: DataCommonService) { }

  login(loginData: LoginInterface){
    return this.dataService.login(loginData);
  }

  saveToken(token: string){
    return this.dataService.saveToken(token);
  }

  logout(){
    return this.dataService.logout();
  }

  loadProfile(){
    return this.dataService.loadUserProfile();
  }
}
