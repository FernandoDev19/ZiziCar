import { Component, ViewChild } from '@angular/core';
import { RequestFormComponent } from "./request-form/request-form.component";
import { ResumeComponent } from "./resume/resume.component";
import { WhyUsComponent } from "./why-us/why-us.component";
import { AlliesComponent } from "./allies/allies.component";
import { AvailableCitiesComponent } from "./available-cities/available-cities.component";
import { FaqComponent } from "./faq/faq.component";
import { GammaExamplesComponent } from "./gamma-examples/gamma-examples.component";
import { NatureCareComponent } from "./nature-care/nature-care.component";
import { PutItToWorkComponent } from "./put-it-to-work/put-it-to-work.component";
import { NewsComponent } from "./news/news.component";
import { OtherServicesComponent } from "./other-services/other-services.component";

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
