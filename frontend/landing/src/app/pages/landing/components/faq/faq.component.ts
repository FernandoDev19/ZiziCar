import { NgClass, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { allFaq } from './constants/faq.constant';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-faq',
  imports: [NgClass, FontAwesomeModule],
  standalone: true,
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent implements OnInit {
  faSearch: IconDefinition = faSearch;
  showAllFaq: boolean = false;
  filteredAllFaq: { label: string; answer: string; isShowingAnswer: boolean; }[] = [];

  ngOnInit(): void {
      this.filteredAllFaq = allFaq;
  }

  get getFaq(){
    let faq = [];
    if(this.showAllFaq){
      for(let i = 0; i < this.filteredAllFaq.length; i++){
        faq.push(this.filteredAllFaq[i]);
      }
    }else{
      for(let i = 0; i < this.filteredAllFaq.length - 24; i++){
        faq.push(this.filteredAllFaq[i]);
      }
    }
    return faq;
  }

  showAnswer(n: number) {
    const isCurrentlyOpen = this.filteredAllFaq[n].isShowingAnswer;

    this.filteredAllFaq.forEach(faq => faq.isShowingAnswer = false);

    if (!isCurrentlyOpen) {
      this.filteredAllFaq[n].isShowingAnswer = true;
    }
  }

  toggleShowMore(){
    this.showAllFaq = !this.showAllFaq;
  }

  searchFaq(search: Event) {
    let value = (<HTMLInputElement>search.target).value.trim().toLowerCase();
    this.showAllFaq = true;

    if (value === '') {
      this.filteredAllFaq = [...allFaq];
      this.showAllFaq = false;
      return;
    }

    let normalizedValue = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    this.filteredAllFaq = allFaq.filter(faq => {
      let normalizedLabel = faq.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return normalizedLabel.includes(normalizedValue);
    });
  }

}
