import { Injectable } from '@angular/core';
import { DataCommonService } from '../../../common/services/data-common.service';
import { UpdateCustomerModel } from '../interfaces/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerDataService {

  constructor(private dataCommon: DataCommonService) { }

  getCustomers(){
    return this.dataCommon.getCustomers();
  }

  getCustomerByPhone(phone: string){
    return this.dataCommon.getCustomerByPhone(phone);
  }

  updateCustomer(id: string, customer: UpdateCustomerModel){
    return this.dataCommon.updateCustomerModel(id, customer);
  }

  getCustomersWithoutConfirmingPayment(){
    return this.dataCommon.getCustomersWithoutConfirmingPayment();
  }

  deleteCustomerById(id: string){
    return this.dataCommon.deleteCustomerById(id);
  }
}
