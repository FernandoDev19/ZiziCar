import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { GetNewInterface } from '../interfaces/new.interface';

@Injectable({
  providedIn: 'root'
})
export class NewService {

  private urlBase: string = environment.apiUrl;
  private newRoutes = {
    getAllActives: '/new/active'
  }

  constructor(private http: HttpClient) { }

  getActiveNews(): Observable<GetNewInterface[]>
  {
     return this.http.get<GetNewInterface[]>(this.urlBase + this.newRoutes.getAllActives).pipe(
      catchError(e => {
        return throwError(() => e);
      })
     );
  }
}
