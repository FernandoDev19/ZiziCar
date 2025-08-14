import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { QuotesListComponent } from "./tables/quotes-list/quotes-list.component";
import { SidebarHorizontalComponent } from "../../components/sidebar/horizontal/horizontal.component";

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, SidebarComponent, QuotesListComponent, SidebarHorizontalComponent],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.css'
})
export class QuotesComponent {
  activeItem: number = 0;

  items = [
    { label: 'Cotizaciones' },
    { label: 'Option 2' }
  ];

  setActiveTab(index: number) {
    this.activeItem = index;
  }
}
