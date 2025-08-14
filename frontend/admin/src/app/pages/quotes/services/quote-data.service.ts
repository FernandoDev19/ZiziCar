import { Injectable } from '@angular/core';
import { DataCommonService } from '../../../common/services/data-common.service';
import { PostQuoteInterface } from '../interfaces/quote.interface';

@Injectable({
  providedIn: 'root'
})
export class QuoteDataService {

  constructor(private dataCommon: DataCommonService) { }

  createQuote(quote: PostQuoteInterface){
    return this.dataCommon.createQuote(quote);
  }

  getQuotes(){
    return this.dataCommon.getQuotes();
  }

  getQuotesWhereRequestId(requestId: string){
    return this.dataCommon.getQuotesWhereRequestId(requestId);
  }

  getQuote(id: string){
    return this.dataCommon.getQuote(id);
  }

  quoteExist(requestId: string, renterId: string){
    return this.dataCommon.quoteExist(requestId, renterId);
  }

  deleteQuote(quoteId: string){
    return this.dataCommon.deleteQuote(quoteId);
  }
}
