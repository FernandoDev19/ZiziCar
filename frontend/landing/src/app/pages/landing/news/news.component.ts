import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { windowWhen } from 'rxjs';
import { NewService } from '../../../common/services/new.service';
import { GetNewInterface } from '../../../common/interfaces/new.interface';

@Component({
  selector: 'app-news',
  imports: [CarouselModule, ButtonModule],
  standalone: true,
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit {
  news!: number[];

  constructor(
    private newService: NewService
  ){}

  ngOnInit(): void {
    // this.getActiveNews();
  }

  // getActiveNews(){
  //   this.newService.getActiveNews().subscribe({
  //     next: news => {
  //       this.news = news;
  //     }
  //   });
  // }

  get numVisible(){
    if(window.innerWidth <= 714){
      return 1;
    }else{
      return 3;
    }
  }
}
