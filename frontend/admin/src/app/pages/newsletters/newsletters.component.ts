import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { SidebarHorizontalComponent } from "../../components/sidebar/horizontal/horizontal.component";

@Component({
  selector: 'app-newsletters',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, FooterComponent, SidebarHorizontalComponent],
  templateUrl: './newsletters.component.html',
  styleUrl: './newsletters.component.css'
})
export class NewslettersComponent {

}
