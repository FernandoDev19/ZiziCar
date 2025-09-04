import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnInit {
  message!: string;
  messagesOld: string[] = [];

  constructor(private communicationService: CommunicationService){}

  ngOnInit(): void {
    this.communicationService.message.subscribe((getMessage) => {
      setTimeout(() => {
        if(!this.messagesOld.includes(getMessage)){
          this.message = getMessage;
        }
      }, 0);
    });
  }

  toggleAlert(){
    this.messagesOld.push(this.message);
    this.message = '';
    this.communicationService.message.next('');
  }
}
