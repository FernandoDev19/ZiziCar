import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { UserFormComponent } from './forms/user-form/user-form.component';
import { ProviderFormComponent } from './forms/provider-form/provider-form.component';
import { UserDataCommunicationService } from './services/user-data-communication.service';
import { UsersListComponent } from './tables/users-list/users-list.component';
import { Role } from '../../../common/enums/roles';
import { CreateUserInterface } from './interfaces/user.interface';
import { CreateProviderInterface } from '../../providers/interfaces/provider.interface';
import { ProviderDataService } from '../../providers/services/provider-data.service';
import { UserDataService } from './services/user-data.service';
import { CommunicationService } from '../../../common/services/communication.service';
import { GetCityInterface } from '../../../common/interfaces/geolocation.interface';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UserFormComponent, ProviderFormComponent, UsersListComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements AfterViewInit{
  isRoleProvider: boolean = false;

  @ViewChild('providerData') providerData!: ElementRef;
  @ViewChild('usersList') usersList!: ElementRef;

  @ViewChild(UserFormComponent) userFormComponent!: UserFormComponent;
  @ViewChild(ProviderFormComponent) providerFormComponent!: ProviderFormComponent;

  constructor(private globalCommunication: CommunicationService, private userDataCommunication: UserDataCommunicationService, private providerService: ProviderDataService, private userDataService: UserDataService){}

  ngAfterViewInit(): void {
    this.userDataCommunication.isRoleProvider.subscribe(isRoleProvider => {
      this.isRoleProvider = isRoleProvider;
      setTimeout(()=>{
        if (this.providerData && this.isRoleProvider) {
          const elementPosition = this.providerData.nativeElement.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: elementPosition, behavior: 'smooth' });
        }
      }, 100);
    })
  }

  async createUser(){
    if(this.isRoleProvider && this.providerFormComponent.providerForm.valid){
      if(this.userFormComponent.userForm.valid){
        const formProviderData = this.providerFormComponent.providerForm.value;
        formProviderData.cities_preferences = formProviderData.cities_preferences.map((city: GetCityInterface) => city.id);

        const providerData: CreateProviderInterface = {
          ...formProviderData,
          name: this.userFormComponent.userForm.get('name')?.value,
          email: this.userFormComponent.userForm.get('email')?.value
        }

        this.globalCommunication.loading.emit(true);

        await this.providerService.createProvider(providerData).subscribe({
          next: provider => {
            if(provider){
              const userData: CreateUserInterface = {
                ...this.userFormComponent.userForm.value,
                provider_id: provider.id
              }
              this.userDataService.createUser(userData).subscribe({
                next: user => {
                  this.userDataCommunication.emitReloadUsersTable();
                },
                error: err => {
                  console.error('Ha ocurrido un error:', err);
                }
              });
            }
          },
          error: error => {
            this.globalCommunication.loading.emit(false);
            console.error('Ha ocurrido un error:', error);
          },
          complete: () => {
            this.userFormComponent.userForm.reset();
            this.providerFormComponent.providerForm.reset();
            const elementPosition = this.usersList.nativeElement.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: elementPosition, behavior: 'smooth' });
            this.globalCommunication.loading.emit(false);
          }
        })
      }
    }
  }
}
