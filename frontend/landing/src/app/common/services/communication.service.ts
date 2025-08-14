import { EventEmitter, Injectable } from '@angular/core';
import { GetGammaInterface } from '../interfaces/gamma.interface';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  gammas = new EventEmitter<GetGammaInterface[]>();

  message = new EventEmitter<string>();
  dataForResume = new EventEmitter<{
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
  }>();

  constructor() { }
}
