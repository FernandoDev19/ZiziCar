import { Component } from '@angular/core';
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { HeaderComponent } from "../components/header/header.component";
import { CommonModule } from '@angular/common';
import { VehicleFormComponent } from "./forms/vehicle-form/vehicle-form.component";
import { VehiclesListComponent } from "./tables/vehicles-list/vehicles-list.component";
import { FooterComponent } from "../components/footer/footer.component";
import { SidebarHorizontalComponent } from "../components/sidebar/horizontal/horizontal.component";

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, VehicleFormComponent, VehiclesListComponent, FooterComponent, SidebarHorizontalComponent],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export class VehiclesComponent {
  items = [
    { label: 'Vehículos' },
    { label: 'Gamas' }
  ];

  activeItem = 0;

  setActiveTab(index: number) {
    this.activeItem = index;
  }

  async createVehicle(){

  }
}
