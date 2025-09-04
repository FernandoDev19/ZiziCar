import { Component, ViewChild } from '@angular/core';
import { RequestFormComponent } from "./components/request-form/request-form.component";
import { ResumeComponent } from "./components/resume/resume.component";
import { WhyUsComponent } from "./components/why-us/why-us.component";
import { AlliesComponent } from "./components/allies/allies.component";
import { AvailableCitiesComponent } from "./components/available-cities/available-cities.component";
import { FaqComponent } from "./components/faq/faq.component";
import { GammaExamplesComponent } from "./components/gamma-examples/gamma-examples.component";
import { NatureCareComponent } from "./components/nature-care/nature-care.component";
import { PutItToWorkComponent } from "./components/put-it-to-work/put-it-to-work.component";
import { NewsComponent } from "./components/news/news.component";
import { OtherServicesComponent } from "./components/other-services/other-services.component";

@Component({
  selector: 'app-landingpage',
  imports: [RequestFormComponent, ResumeComponent, WhyUsComponent, AlliesComponent, AvailableCitiesComponent, FaqComponent, GammaExamplesComponent, NatureCareComponent, PutItToWorkComponent, /*NewsComponent,*/ OtherServicesComponent, NewsComponent],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.css',
  standalone: true
})
export class LandingpageComponent {

  @ViewChild('requestFormComponent') requestFormComponent!: RequestFormComponent;

  back(){
    this.requestFormComponent.isShowingContactForm = false;
  }
}
