import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CustomersListComponent } from "./tables/customers-list/customers-list.component";
import { SidebarHorizontalComponent } from "../../components/sidebar/horizontal/horizontal.component";

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, SidebarComponent, CustomersListComponent, SidebarHorizontalComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {
}
