import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ProvidersListComponent } from "./tables/providers-list/providers-list.component";
import { SidebarHorizontalComponent } from "../../components/sidebar/horizontal/horizontal.component";

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, SidebarComponent, ProvidersListComponent, SidebarHorizontalComponent],
  templateUrl: './providers.component.html',
  styleUrl: './providers.component.css'
})
export class ProvidersComponent {
  activeItem = 0;

  items = [
    { label: 'Aliados' },
    { label: 'Option 2' }
  ];

  setActiveTab(index: number) {
    this.activeItem = index;
  }
}
