import { Component, Input, OnInit, output } from '@angular/core';
import { GetCustomerInterface } from '../../../../../customers/interfaces/customer.interface';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../../../../../../common/services/communication.service';
import { CustomerDataService } from '../../../../../customers/services/customer-data.service';

@Component({
  selector: 'app-customer-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-data.component.html',
  styleUrl: './customer-data.component.css'
})
export class CustomerDataComponent implements OnInit {
  customerData!: GetCustomerInterface;
  @Input() phoneClient!: string;
  isCustomerDataLoaded = output<boolean>();
   toggleModalEmitter = output<string>();

   constructor(
    private globalCommunication: CommunicationService,
    private customerService: CustomerDataService
   ){}

   ngOnInit(): void {
    this.getClient(this.phoneClient);
   }

  toggleModal(type: string){
    this.toggleModalEmitter.emit(type);
  }

  getClient(phone: string) {
    this.globalCommunication.loading.emit(true);
    this.customerService.getCustomerByPhone(phone).subscribe({
      next: (customer) => {
        this.customerData = customer;
      },
      error: (error) => {
        alert('Error al obtener el cliente. \n' + 'No existe');
        this.globalCommunication.loading.emit(false);
        this.isCustomerDataLoaded.emit(false);
      },
      complete: () => {
        this.globalCommunication.loading.emit(false);
        this.isCustomerDataLoaded.emit(true);
      },
    });
  }
}
