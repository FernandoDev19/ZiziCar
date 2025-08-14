import { Component, HostListener } from '@angular/core';
import { CommunicationService } from '../../../common/services/communication.service';
import { CommonModule } from '@angular/common';
import { SidebarNavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-sidebar-horizontal',
  standalone: true,
  imports: [CommonModule, SidebarNavComponent],
  templateUrl: './horizontal.component.html',
  styleUrl: './horizontal.component.css'
})
export class SidebarHorizontalComponent {
  isCollapsed: boolean = true;
  isTablesCollapsed: boolean = false;
  isMobile: boolean = false;

  constructor(){}

  ngOnInit(): void {
    this.checkScreen();
  }

  toggleTables() {
    this.isTablesCollapsed = !this.isTablesCollapsed;
  }

  @HostListener('window:resize', ['$event'])
  checkScreen() {
    const width = window.innerWidth;
    this.isMobile = width <= 768;
  }
}
