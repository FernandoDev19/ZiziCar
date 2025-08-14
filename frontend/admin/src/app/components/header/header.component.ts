import { Component, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../pages/auth/login/services/login.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ProfileService } from '../../common/services/profile.service';
import { Role } from '../../common/enums/roles';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, OverlayPanelModule, RouterModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @ViewChild('overlayUser') overlayUser!: OverlayPanel;
  userName!: string;
  userRole!: string;
  roles = Role;

  constructor(private loginService: LoginService, private router: Router, private profileService: ProfileService){}

  ngOnInit(): void {
    this.getUsername();
  }

  getUsername(){
    this.profileService.getProfile().subscribe({
      next: user => {
        this.userName = user.name;
        this.userRole = user.role as Role;
      },
      error: err => {
        console.error('Error al obtener el username.', err)
      }
    })
  }

  toggleUser(event: Event) {
    this.overlayUser.toggle(event);
  }

  logout(){
    this.loginService.logout().subscribe({
      next: (isLogout) => {
        if(isLogout){
          this.router.navigate(['/auth/login']);
        }
      }
    });
  }
}
