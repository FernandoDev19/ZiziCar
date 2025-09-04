import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-other-services',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './other-services.component.html',
  styleUrl: './other-services.component.css',
})
export class OtherServicesComponent {
  protected scrollToForm() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
