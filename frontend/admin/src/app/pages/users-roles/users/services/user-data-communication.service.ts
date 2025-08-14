import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataCommunicationService {

  @Output() isRoleProvider = new EventEmitter<boolean>();
  private reloadUsersTableSubject = new BehaviorSubject<void>(undefined);
  reloadUsersTable$ = this.reloadUsersTableSubject.asObservable();

  constructor() { }

  emitReloadUsersTable() {
    this.reloadUsersTableSubject.next();
  }
}
