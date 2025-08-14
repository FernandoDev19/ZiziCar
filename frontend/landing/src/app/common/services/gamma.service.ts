import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetGammaInterface } from '../interfaces/gamma.interface';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GammaService {

  private urlBase: string = environment.apiUrl;
  private gammaRoutes = {
    getAll: '/gamma',
    averagePrices: '/gamma/get-average-prices'
  }

  constructor(private http: HttpClient) { }

  getGammas(): Observable<GetGammaInterface[]>
  {
    return this.http.get<GetGammaInterface[]>(this.urlBase + this.gammaRoutes.getAll).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getAveragePrices(): Observable<{gammaId: string; averagePrice: number}[]>
  {
    return this.http.get<{gammaId: string; averagePrice: number}[]>(this.urlBase + this.gammaRoutes.averagePrices).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

}
