import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CarouselModule, ButtonModule, FontAwesomeModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})

export class CommentsComponent {
  comments: {
    username: string;
    userCommentary: string;
  }[] = [];

  //icons
  faUser: IconDefinition = faUser;

  get numVisible(){
    if(window.innerWidth <= 714){
      return 1;
    }else{
      return 3;
    }
  }
}
