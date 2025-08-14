import { Component } from '@angular/core';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { SidebarHorizontalComponent } from "../../components/sidebar/horizontal/horizontal.component";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [SidebarComponent, SidebarHorizontalComponent, HeaderComponent, FooterComponent],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent {

}
