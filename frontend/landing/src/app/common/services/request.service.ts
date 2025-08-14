import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CreateRequestDto, GetRequestDto } from '../interfaces/request.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private urlBase: string = environment.apiUrl;
  private requestRoutes = {
    create: '/requests'
  }

  constructor(private http: HttpClient) { }

    createRequest(request: CreateRequestDto): Observable<GetRequestDto>
    {
      return this.http.post<GetRequestDto>(this.urlBase + this.requestRoutes.create, request).pipe(
        catchError(e => {
          return throwError(() => e);
        })
      );
    }
}
