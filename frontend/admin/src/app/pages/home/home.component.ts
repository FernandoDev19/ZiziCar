import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { SidebarHorizontalComponent } from '../../components/sidebar/horizontal/horizontal.component';
import { UserDataService } from '../users-roles/users/services/user-data.service';
import { RequestDataService } from '../requests/services/request-data.service';
import { CommunicationService } from '../../common/services/communication.service';
import { ProfileService } from '../../common/services/profile.service';
import { Role } from '../../common/enums/roles';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, SidebarComponent, SidebarHorizontalComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  userRole!: Role;
  Role = Role;

  usersCount!: number;
  employeesCount!: number;

  requestsCount!: number;
  requestsQuotesCount!: number;
  requestsUnquotesCount!: number;
  requestsWithOtherAnswers!: number;
  requestsExpiredsCount!: number;

  constructor(
    private communicationService: CommunicationService,
    private profileService: ProfileService,
    private userService: UserDataService,
    private requestService: RequestDataService
    ){}

  ngOnInit(): void {
      this.getAuthUser();
  }

  getAuthUser() {
    this.communicationService.loading.emit(true);
    this.profileService.getProfile().subscribe({
      next: async (user) => {
        this.userRole = user.role as Role;
        if(this.userRole === Role.ADMIN){
          this.usersCount = await this.getUsersCount();
          this.requestsExpiredsCount = await this.getRequestsCount('expireds');
        }else{

        }
        this.requestsCount = await this.getRequestsCount('all');
        this.requestsQuotesCount = await this.getRequestsCount('quotes');
        this.requestsUnquotesCount = await this.getRequestsCount('unquotes');
        this.requestsWithOtherAnswers = await this.getRequestsCount('answers');
        this.communicationService.loading.emit(false);
      },
      error: (err) => {
        console.error('Error al obtener el usuario', err);
      },
    });
  }

  async getUsersCount(): Promise<number>
  {
    try{
      const users = await firstValueFrom(this.userService.getAll());
      return users.length;
    }catch{
      return 0;
    }
  }

  async getRequestsCount(condition: string): Promise<number>
  {
    try{
      return await firstValueFrom(this.requestService.countRequests(condition));
    }catch{
      return 0;
    }
  }
}
