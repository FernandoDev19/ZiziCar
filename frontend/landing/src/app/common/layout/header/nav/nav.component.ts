import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-nav',
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  standalone: true,
})
export class NavComponent implements OnInit {
  isMobile = false;
  isMobileMenuOpen = false;

  constructor() {}

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  private checkScreenSize() {
    const mobileBreakpoint = 768;
    const screenWidth = window.innerWidth;
    this.isMobile = screenWidth <= mobileBreakpoint;
    this.isMobileMenuOpen = screenWidth > mobileBreakpoint;
  }
}
