import { Injectable } from '@angular/core';
import { DataCommonService } from './data-common.service';
import { PostAnswerInterface } from '../interfaces/common.interface';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  constructor(private dataCommonService: DataCommonService) { }

  createAnswer(answer: PostAnswerInterface){
    return this.dataCommonService.createAnswer(answer);
  }

  getAnswer(request_id: string, renter_id: string){
    return this.dataCommonService.getAnswer(request_id, renter_id);
  }

  getAnswers(){
    return this.dataCommonService.getAnswers();
  }

  getAnswersByRequest(requestId: string){
    return this.dataCommonService.getAnswersByRequest(requestId);
  }
}
