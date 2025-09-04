import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-allies',
  standalone: true,
  imports: [CarouselModule, ButtonModule, NgOptimizedImage],
  templateUrl: './allies.component.html',
  styleUrl: './allies.component.css'
})
export class AlliesComponent {
  allies = [
    {
      img: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/logos/aliados/renting-logo-min.webp',
      style: { backgroundColor: 'white' },
      link: 'https://www.rentingcolombia.com/'
    },
    {
      img: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/logos/aliados/milano-logo-min.webp',
      style: { backgroundColor: 'white' },
      link: 'https://milanocar.com/'
    },
    {
      img: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/logos/aliados/localiza-logo-min.webp',
      style: { backgroundColor: '#00863d' },
      link: 'https://www.localiza.com/'
    },
    {
      img: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/logos/aliados/car-rent-logo-min.webp',
      style: { backgroundColor: 'white' },
      link: 'https://carrent.com.co/'
    },
    {
      img: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/logos/aliados/alamo-logo-min.webp',
      style: { backgroundColor: '#2360a5' },
      link: 'https://www.alamo.co/'
    }
  ];

  get numVisible(){
    const minWidth = 714;
    if(window.innerWidth <= minWidth){
      return 3;
    }else{
      return 6
    }
  }
}
