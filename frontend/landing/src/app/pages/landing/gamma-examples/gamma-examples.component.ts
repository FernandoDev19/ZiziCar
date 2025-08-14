import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { GetGammaInterface } from '../../../common/interfaces/gamma.interface';
import { CommunicationService } from '../../../common/services/communication.service';

@Component({
  selector: 'app-gamma-examples',
  imports: [CarouselModule, ButtonModule],
  standalone: true,
  templateUrl: './gamma-examples.component.html',
  styleUrl: './gamma-examples.component.css'
})
export class GammaExamplesComponent implements OnInit {
  gammas!: GetGammaInterface[];

  constructor(
    private communicationService: CommunicationService
  ){}

  ngOnInit(): void {
    this.getGammas();
  }

  getGammas(){
    this.communicationService.gammas.subscribe(gammas => {
      setTimeout(() => {
        this.gammas = gammas;
      }, 100);
    })
  }

  get numVisible(){
    if(window.innerWidth <= 714){
      return 1;
    }else{
      return 3;
    }
  }
}
