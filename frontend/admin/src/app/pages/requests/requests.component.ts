import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { RequestsListComponent } from './tables/requests-list/requests-list.component';
import { QuoteComponent } from './quote/quote.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { SidebarHorizontalComponent } from "../../components/sidebar/horizontal/horizontal.component";

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    RequestsListComponent,
    QuoteComponent,
    FontAwesomeModule,
    SidebarHorizontalComponent
],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css',
})
export class RequestsComponent implements OnInit {
  isQuote: boolean = false;
  requestId!: string;

  faArrowLeft: IconDefinition = faArrowLeft;

  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('requestId')) {
      this.requestId = this.route.snapshot.paramMap.get('requestId') || '';
      console.log(this.requestId);
      this.showRequestToQuote(this.requestId);
    }
  }

  showRequestToQuote(id: string) {
    let intentos = 0;

    while (!this.requestId && intentos < 10) {
      this.requestId = id;
      intentos++;
      if (this.requestId) break;
    }

    if (this.requestId) {
      this.isQuote = true;
    } else {
      this.isQuote = false;
      alert('Error al obtener id');
    }
  }

  hideRequestToQuote(){
    this.requestId = '';
    this.isQuote = false;
  }

  scrollTo(cantidad: number) {
    const container = document.querySelector('.contenedor-padre');
    container?.scrollTo({ top: cantidad, behavior: 'smooth' });
  }

}
