import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Geolocation } from '../interfaces/geolocation.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  private urlBase: string = environment.apiUrl;
  private geolocationRoutes = {
    getAll: '/geolocations'
  }

  constructor(private http: HttpClient) { }

  getGeolocations(): Observable<Geolocation[]>
  {
    return this.http.get<Geolocation[]>(this.urlBase + this.geolocationRoutes.getAll).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }
}
