import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: 'app-footer',
  imports: [FontAwesomeModule, NgOptimizedImage],
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  protected scrollToForm() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
