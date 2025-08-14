import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SidebarHorizontalComponent } from "../../components/sidebar/horizontal/horizontal.component";

@Component({
  selector: 'app-users-roles',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, UsersComponent, RolesComponent, HeaderComponent, FooterComponent, SidebarComponent, SidebarHorizontalComponent],
  templateUrl: './users-roles.component.html',
  styleUrl: './users-roles.component.css'
})
export class UsersRolesComponent {

  faUser: IconDefinition = faUser;

  items = [
    { label: 'Usuarios' },
    { label: 'Roles y Permisos' }
  ];

  activeItem = 0;

  setActiveTab(index: number) {
    this.activeItem = index;
  }
}
