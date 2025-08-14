import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { GeolocationService } from '../../../../common/services/geolocation.service';
import { CommunicationService } from '../../../../common/services/communication.service';

@Component({
  selector: 'app-contact-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  standalone: true,
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent implements OnInit {
  contactForm!: FormGroup;
  prefixs!: number[];
  @ViewChild('prefix') prefix!: ElementRef;

  @Output() createRequest = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private geolocationService: GeolocationService,
    private communicationService: CommunicationService
  ){}

  ngOnInit(): void
  {
    this.formInit();
    this.getData();
  }

  formInit(){
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      email: ['', [Validators.email, Validators.maxLength(200)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(7), Validators.maxLength(20),]],
      comments: ['', [Validators.maxLength(180)]],
      checkRequest: new FormControl(false, [this.checkboxRequiredValidator()])
    });
  }

  checkboxRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.value === true ? null : { required: true };
    };
  }

  getData(){
    this.geolocationService.getGeolocations().subscribe({
      next: geolocations => {
        this.prefixs = geolocations.flatMap(geolocation => {
          return geolocation.countries.flatMap(country => {
            return country.prefix
          });
        });

      },
      error: e => {
        console.error('Error al obtener los prefijos', e);
        this.communicationService.message.emit('Ha ocurrido un error desconocido, vuelva a intentarlo mas tarde');
      }
    });
  }

  autoExpand(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;

    textarea.style.height = 'auto';

    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  save(){
    if(this.contactForm.valid){
      this.createRequest.emit();
    }else{
      this.communicationService.message.emit('Faltan datos');
    }
  }

}
