import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Popover, PopoverModule } from 'primeng/popover';
import { CommunicationService } from '../../../../common/services/communication.service';
import { faRupiahSign } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-resume',
  imports: [CommonModule, PopoverModule],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.css',
  standalone: true,
})
export class ResumeComponent implements OnInit {
  @ViewChild('popoverResume') popoverResume!: Popover;

  @Output() modify = new EventEmitter();

  isButtonVisible: boolean = false;

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

  constructor(private communicationService: CommunicationService){}

  ngOnInit(): void {
    this.getDataForResume();
  }

  togglePopover(event: Event){
    this.popoverResume.toggle(event);
  }

  getDataForResume(){
    this.communicationService.dataForResume.subscribe(data => {
      this.dataForResume = data;
      if(data.gamma && data.transmission && data.entry && data.devolution){
        this.isButtonVisible = true;
      }
    });
  }

  goToModify(){
    this.modify.emit();
    this.isButtonVisible = false;
    this.popoverResume.hide();
  }

}
