import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import Typed from 'typed.js';
import { VehicleFormComponent } from "./vehicle-form/vehicle-form.component";
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from "./contact-form/contact-form.component";
import { CommunicationService } from '../../../common/services/communication.service';
import { RequestService } from '../../../common/services/request.service';
import { CreateRequestDto } from '../../../common/interfaces/request.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-form',
  imports: [CommonModule, VehicleFormComponent, ContactFormComponent],
  standalone: true,
  templateUrl: './request-form.component.html',
  styleUrl: './request-form.component.css'
})
export class RequestFormComponent implements OnInit{
  @ViewChild('typed', { static: true }) typedElement!: ElementRef;
  @ViewChild('vehicleFormComponent') vehicleFormComponent!: VehicleFormComponent;
  @ViewChild('contactFormComponent') contactFormComponent!: ContactFormComponent;
  isMobile: boolean = false;
  isShowingContactForm: boolean = false;

  //Emits recibidos
  dataForResume?: {
    gamma: {
      name: string;
      image: string;
      average_price: number;
    },
    transmission?: {
      name: string;
    },
    entry?: {
      city: string;
      dateTime: string;
      receive_at_airport: boolean;
    },
    devolution?: {
      city: string;
      dateTime: string;
      returns_at_airport: boolean;
    }
  };

  @Output() modify = new EventEmitter();

  constructor(
    private communicationService: CommunicationService,
    private requestService: RequestService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.checkScreen();
    this.setType();
    this.getDataForResume();
  }

  @HostListener('window:resize', ['$event'])
  checkScreen() {
    const width = window.innerWidth;
    this.isMobile = width <= 768;

    return this.isMobile;
  }

  setType(){
    const options = {
      strings: [
        'Bienvenido...',
        'Welcome...',
        'Bienvenue...',
        'Willkommen...',
        'Benvenuto...',
      ],
      typeSpeed: 80,
      backSpeed: 70,
      loop: true,
      showCursor: false,
    };

    const typed = new Typed(this.typedElement.nativeElement, options);
  }

  toggleContactForm(){
    this.isShowingContactForm = !this.isShowingContactForm;
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  getDataForResume(){
    this.communicationService.dataForResume.subscribe(data => {
      this.dataForResume = data;
    });
  }

  goToModify(){
    this.modify.emit();
  }

  save(){
    if(this.vehicleFormComponent.vehicleForm.valid && this.contactFormComponent.contactForm.valid){
      const request: CreateRequestDto = {
        ...this.vehicleFormComponent.vehicleForm.value,
        comments: this.contactFormComponent.contactForm.get('comments')?.value || null,
        name: this.contactFormComponent.contactForm.get('name')?.value,
        phone: (<HTMLSelectElement>this.contactFormComponent.prefix.nativeElement).value + this.contactFormComponent.contactForm.get('phone')?.value,
        email: this.contactFormComponent.contactForm.get('email')?.value || null
      };

      this.requestService.createRequest(request).subscribe({
        next: requestCreated => {
          console.log(requestCreated);
          this.router.navigate(['/thanks']);
        },
        error: e => {
          console.error('Error to create request.', e);
        }
      });
    }else{
      console.error('Error al generar solicitud: Formulario invalido')
      this.communicationService.message.emit('Error al generar la solicitud');
    }
  }
}
