import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  loading = new EventEmitter<boolean>();
  sidebarCollapse = new EventEmitter<boolean>();

  constructor() { }

}
