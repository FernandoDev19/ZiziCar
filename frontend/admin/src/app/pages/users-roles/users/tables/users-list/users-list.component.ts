import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { GetUserInterface } from '../../interfaces/user.interface';
import { UserDataService } from '../../services/user-data.service';
import { UserDataCommunicationService } from '../../services/user-data-communication.service';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ProviderDataService } from '../../../../providers/services/provider-data.service';
import { CommunicationService } from '../../../../../common/services/communication.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [OverlayPanelModule, FontAwesomeModule, CommonModule, TableModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
})
export class UsersListComponent implements OnInit, OnDestroy {
  activeItem = 0;
  users: GetUserInterface[] = [];
  userId!: string;

  //Overlays
  @ViewChild('actions') actions!: OverlayPanel;

  //icons
  faCaretDown: IconDefinition = faCaretDown;

  private destroy$ = new Subject<void>();

  items = [{ label: 'Usuarios' }];

  splitButtonItems = [
    {
      label: 'Eliminar',
      type: 'delete',
    },
  ];

  constructor(
    private userService: UserDataService,
    private providerService: ProviderDataService,
    private userDataCommunication: UserDataCommunicationService,
    private globalCommunication: CommunicationService
  ) {
    this.userDataCommunication.reloadUsersTable$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.userService.getAll())
      )
      .subscribe({
        next: (users) => {
          this.users = users;
        },
      });
  }

  ngOnInit(): void {
    this.getUsers();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUsers() {
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
      },
    });
  }

  setActiveTab(index: number) {
    this.activeItem = index;
  }

  showOverlay(event: Event, type: 'splitbutton', id: string = '') {
    this.userId = id;
    if (type === 'splitbutton') {
      this.actions.toggle(event);
    }
  }

  onSearch(event: Event, dtRequests: any): void {
    const input = event.target as HTMLInputElement;
    const value = input?.value || '';
    dtRequests.filterGlobal(value, 'contains');
  }

  get globalFields() {
    const fieldsForAdmin = [
      'name',
      'email',
      'role',
      'created_at',
      'updated_at'
    ];
    return fieldsForAdmin;
  }

  async doAction(type: string) {
    switch (type) {
      case 'delete':
        await this.delete(this.userId);
        break;
      default:
        console.error('No se ha seleccionado una opcion correcta');
    }
  }

  async delete(id: string) {
    if (id) {
      this.actions.hide();
      this.globalCommunication.loading.emit(true);
      this.userService.deleteUser(id).subscribe({
        next: (user) => {
          console.log('user deleted', user);
          if (user.provider_id) {
            this.providerService.deleteProvider(user.provider_id).subscribe({
              next: (provider) => {
                console.log('provider deleted', provider);
              },
            });
          }
        },
        error: (err) => {
          console.error('error:', err);
          this.globalCommunication.loading.emit(false);
        },
        complete: () => {
          this.userDataCommunication.emitReloadUsersTable();
          this.globalCommunication.loading.emit(false);
        },
      });
    }
  }
}
