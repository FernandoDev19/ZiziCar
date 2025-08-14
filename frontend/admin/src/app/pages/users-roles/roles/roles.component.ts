import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { RolesListComponent } from './tables/roles-list/roles-list.component';
import { RoleFormComponent } from './forms/role-form/role-form.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [RolesListComponent, RoleFormComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {

}
