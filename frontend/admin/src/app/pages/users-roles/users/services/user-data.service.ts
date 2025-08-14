import { Injectable } from '@angular/core';
import { DataCommonService } from '../../../../common/services/data-common.service';
import { CreateUserInterface } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private dataCommon: DataCommonService) { }

  getAll(){
    return this.dataCommon.getUsers();
  }

  createUser(userData: CreateUserInterface){
    return this.dataCommon.createUser(userData);
  }

  deleteUser(id: string){
    return this.dataCommon.deleteUser(id);
  }
}
