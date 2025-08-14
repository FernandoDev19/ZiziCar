import { Component, ElementRef,  Input, ViewChild} from '@angular/core';
import { DataForRequestInformationInterface } from '../quote.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-details-request',
  standalone: true,
  imports: [],
  templateUrl: './details-request.component.html',
  styleUrl: './details-request.component.css',
  providers: [DatePipe]
})
export class DetailsRequestComponent {
  @Input() dataForRequestInformation!: DataForRequestInformationInterface;

  @ViewChild('detailsRequest') detailsRequest!: ElementRef;

  constructor(){}

  toggleCollapse() {
    const detailsRequest = this.detailsRequest.nativeElement;
    detailsRequest.classList.toggle('hidden');
  }

}
