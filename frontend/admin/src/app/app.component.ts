import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { HeaderComponent } from "./components/header/header.component";
import { LoaderComponent } from './components/loader/loader.component';
import { FooterComponent } from "./components/footer/footer.component";
import { CommunicationService } from './common/services/communication.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent, SidebarComponent, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  loader: boolean = false;

  constructor(private router: Router, private communicationService: CommunicationService){
    this.communicationService.loading.subscribe(
      (GetLoader) => { this.loader = GetLoader }
    );
  }
}
