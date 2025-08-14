import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-thanks',
  imports: [RouterLink],
  templateUrl: './thanks.component.html',
  standalone: true,
  styleUrl: './thanks.component.css'
})
export class ThanksComponent {
  title: string = 'Gracias | Zizicar';

  ngOnInit(): void {
    document.getElementsByTagName('title')[0].textContent = this.title;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
