import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUsers,
  faDashboard,
  faCaretDown,
  faCaretUp,
  faUser,
  faBuilding,
  faClipboardList,
  faBriefcase,
  faDollarSign,
  IconDefinition,
  faChartLine,
  faHome,
  faFileAlt,
  faMailBulk,
  faMailReplyAll,
  faCarSide,
  faCar,
  faThList,
  faAd,
  faEnvelope,
  faPencilAlt,
  faQuestionCircle,
  faBook,
  faQuestion,
  faNewspaper,
} from '@fortawesome/free-solid-svg-icons';
import { RolesService } from '../../../common/services/roles.service';
import { CommunicationService } from '../../../common/services/communication.service';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class SidebarNavComponent implements OnInit {
  //icons
  faHome: IconDefinition = faHome;
  faUsers: IconDefinition = faUsers;
  faUser: IconDefinition = faUser;
  faDashboard: IconDefinition = faDashboard;
  faCaretDown: IconDefinition = faCaretDown;
  faCaretUp: IconDefinition = faCaretUp;
  faBuilding: IconDefinition = faBuilding;
  faClipboardList: IconDefinition = faClipboardList;
  faBriefcase: IconDefinition = faBriefcase;
  faDollarSign: IconDefinition = faDollarSign;
  faChartLine: IconDefinition = faChartLine;
  faFileAlt: IconDefinition = faFileAlt;
  faMailBulk: IconDefinition = faMailBulk;
  faMailReplyAll: IconDefinition = faMailReplyAll;
  faCar: IconDefinition = faCar;
  faCards: IconDefinition = faThList;
  faBanners: IconDefinition = faAd;
  faEnvelope: IconDefinition = faEnvelope;
  faBlog: IconDefinition = faPencilAlt;
  faQuestionCircle: IconDefinition = faQuestionCircle;
  faBook: IconDefinition = faBook;
  faGammas: IconDefinition = faCarSide;
  faHelp: IconDefinition = faQuestion;
  faNewspaper: IconDefinition = faNewspaper;

  isCollapsed: boolean = true;

  constructor(public roleService: RolesService, private communicationService: CommunicationService){}

  ngOnInit(): void
  {
    this.communicationService.sidebarCollapse.subscribe(collapsed => {
      this.isCollapsed = collapsed;
    });
  }

}
