import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './roles-list.component.html',
  styleUrl: './roles-list.component.css'
})
export class RolesListComponent {
  activeItem = 0;
  users: {
    name: string;
    country: string;
    company: string;
    representative: string;
  }[] = [
    {
      name: 'Fernando Cano',
      country: 'Colombia',
      company: 'ZiziCar',
      representative: 'Jose Ignacio'
    },
    {
      name: 'Juan Ignacio',
      country: 'Colombia',
      company: 'Milano Rent a Car',
      representative: 'Juan Ignacio'
    }
  ]

  items = [
    { label: 'Roles' },
    { label: 'Roles' }
  ];

  setActiveTab(index: number) {
    this.activeItem = index;
  }
}
