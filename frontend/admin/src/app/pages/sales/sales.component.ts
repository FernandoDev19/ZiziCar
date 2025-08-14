import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SidebarHorizontalComponent } from "../../components/sidebar/horizontal/horizontal.component";

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SidebarComponent, SidebarHorizontalComponent],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent {

}
