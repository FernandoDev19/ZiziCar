import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { SidebarNavComponent } from './nav/nav.component';
import { CommunicationService } from '../../common/services/communication.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarNavComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  isCollapsed: boolean = true;
  isTablesCollapsed: boolean = false;
  isMobile: boolean = false;

  constructor(private communicationService: CommunicationService){}

  ngOnInit(): void {
    this.checkScreen();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.communicationService.sidebarCollapse.emit(this.isCollapsed);
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
