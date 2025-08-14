import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-available-cities',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './available-cities.component.html',
  styleUrl: './available-cities.component.css'
})
export class AvailableCitiesComponent {
  availableCities = [
    {
      img: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/available-cities/bogot%C3%A1-min.webp',
      name: 'Bogotá'
    },
    {
      img: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/available-cities/riohacha-min.webp',
      name: 'Riohacha'
    },
    {
      img: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/available-cities/santa-marta-min.webp',
      name: 'Santa Marta'
    },
    {
      img: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/available-cities/valledupar-min.webp',
      name: 'Valledupar'
    },
    {
      img: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/available-cities/cali-min.webp',
      name: 'Cali'
    },
    {
      img: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/available-cities/cartagena-min.webp',
      name: 'Cartagena'
    },
    {
      img: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/available-cities/medell%C3%ADn-min.webp',
      name: 'Medellín'
    },
    {
      img: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/available-cities/barranquilla-min.webp',
      name: 'Barranquilla'
    }
  ];
}
