import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { LoginInterface } from '../../pages/auth/login/interfaces/login.interface';
import {
  CreateUserInterface,
  GetUserInterface,
} from '../../pages/users-roles/users/interfaces/user.interface';
import { Router } from '@angular/router';
import {
  CreateProviderInterface,
  GetProviderInterface,
} from '../../pages/providers/interfaces/provider.interface';
import { GetRequestInterface } from '../../pages/requests/interfaces/request.interface';
import {
  GetAnswerInterface,
  GetGammaModel,
  GetRequestProviderRelation,
  GetTransmissionModel,
  PostAnswerInterface,
} from '../interfaces/common.interface';
import { GetCustomerInterface, UpdateCustomerModel } from '../../pages/customers/interfaces/customer.interface';
import { GetQuoteInterface, PostQuoteInterface } from '../../pages/quotes/interfaces/quote.interface';
import { ReservationConfirmationModel } from '../../pages/requests/interfaces/reservation-confirmation.interface';
import { Role } from '../enums/roles';
import { GetCityInterface, GetCountryInterface, GetStateInterface } from '../interfaces/geolocation.interface';
import { DataTableForRequestAdminInterface, DataTableForRequestProviderInterface } from '../../pages/requests/interfaces/data-table-for-requests.interface';

@Injectable({
  providedIn: 'root',
})
export class DataCommonService {
  private urlBase: string = 'https://api.zizicar.com/api/v1';
  userRole: string | null = null;

  constructor(private http: HttpClient) {}

  loadUserProfile(): Observable<void> {
    return this.getProfile().pipe(
      map(user => {
        this.userRole = user.role;
      }),
      catchError(error => {
        console.error('Error al cargar el perfil del usuario:', error);
        return of();
      })
    );
  }

  login(loginData: LoginInterface): Observable<string> {
    return this.http
      .post(this.urlBase + '/auth/login', loginData, { responseType: 'text' })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  saveToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    const tokenData = localStorage.getItem('jwtToken');
    if (tokenData) {
      const parsedToken = JSON.parse(tokenData);
      return parsedToken.accessToken;
    }
    return null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  logout(): Observable<boolean> {
    localStorage.removeItem('jwtToken');
    return of(true);
  }

  register(email: string, password: string) {
    const body = {
      email: email,
      password: password,
    };
    this.http
      .post(this.urlBase + 'auth/register', body)
      .subscribe((response) => {
        console.log(response);
      });
  }

  canActivate(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<boolean>(`${this.urlBase}/auth/profile`, { headers })
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  getProfile(): Observable<GetUserInterface>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<GetUserInterface>(`${this.urlBase}/auth/profile`, { headers }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getProfileWithProviderData(): Observable<GetProviderInterface>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<GetProviderInterface>(`${this.urlBase}/auth/profile/provider`, { headers }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  isAdmin(): boolean {
    return this.userRole === Role.ADMIN;
  }

  isProvider(): boolean {
    return this.userRole === Role.PROVIDER;
  }

  // Users
  createUser(userData: CreateUserInterface): Observable<CreateUserInterface> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .post<CreateUserInterface>(this.urlBase + '/users', userData, { headers })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  getUsers(): Observable<GetUserInterface[]> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .get<GetUserInterface[]>(this.urlBase + '/users', { headers })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  deleteUser(id: string): Observable<GetUserInterface> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .delete<GetUserInterface>(this.urlBase + '/users/' + id, { headers })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  //Providers
  getProviders(): Observable<GetProviderInterface[]>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http.get<GetProviderInterface[]>(this.urlBase + '/providers', { headers }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  createProvider(
    providerData: CreateProviderInterface
  ): Observable<CreateProviderInterface> {
    return this.http
      .post<CreateProviderInterface>(this.urlBase + '/providers', providerData)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  getProviderWithId(id: string): Observable<GetProviderInterface>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .get<GetProviderInterface>(this.urlBase + '/providers/id/' + id, { headers })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  getProviderWithEmail(email: string): Observable<GetProviderInterface>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .get<GetProviderInterface>(this.urlBase + '/providers/email/' + email, { headers })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  getProviderWithNit(nit: string): Observable<GetProviderInterface>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .get<GetProviderInterface>(this.urlBase + '/providers/' + nit, { headers })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  deleteProviderWithId(id: string): Observable<GetProviderInterface> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .delete<GetProviderInterface>(this.urlBase + '/providers/' + id, {
        headers,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  //customers
  getCustomers(): Observable<GetCustomerInterface[]>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token
    });

    return this.http.get<GetCustomerInterface[]>(this.urlBase + '/customers', { headers }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getCustomerByPhone(phone: string): Observable<GetCustomerInterface>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token
    });

    return this.http.get<GetCustomerInterface>(this.urlBase + '/customers/' + phone, { headers }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  updateCustomerModel(id: string, data: UpdateCustomerModel): Observable<UpdateCustomerModel>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token
    });

    return this.http.put<UpdateCustomerModel>(this.urlBase + '/customers/' + id, data, { headers }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getCustomersWithoutConfirmingPayment(): Observable<GetCustomerInterface[]> {
     const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token
    });

    return this.http
      .get<GetCustomerInterface[]>(
        this.urlBase + '/customers/without-confirming-payment', { headers }
      )
      .pipe(
        catchError((error) => {
          console.error(
            'Ha ocurrido un error al obtener los clientes, error:',
            error
          );
          return throwError(() => error);
        })
      );
  }

  deleteCustomerById(id: string): Observable<GetCustomerInterface>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token
    });

    return this.http.delete<GetCustomerInterface>(this.urlBase + '/customers/' + id, { headers }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  //requests
  getRequests(): Observable<DataTableForRequestAdminInterface[]> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .get<DataTableForRequestAdminInterface[]>(this.urlBase + '/requests', { headers })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  getRequestsForProviders(): Observable<DataTableForRequestProviderInterface[]>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .get<DataTableForRequestProviderInterface[]>(this.urlBase + '/requests', { headers })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  sendReservationConfirmation(
    data: ReservationConfirmationModel
  ): Observable<ReservationConfirmationModel> {
    return this.http
      .post<ReservationConfirmationModel>(
        this.urlBase + '/requests/send-reservation-confirmation',
        data
      )
      .pipe(
        catchError((error) => {
          console.error(
            'Error al enviar confirmacion de reserva, error:',
            error
          );
          return throwError(() => error);
        })
      );
  }

  getRequest(id: string): Observable<GetRequestInterface>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .get<GetRequestInterface>(this.urlBase + '/requests/' + id, { headers })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  countRequests(condition: string): Observable<number>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http.get<number>(this.urlBase + '/requests/count/' + condition, { headers });
  }

  deleteRequest(id: string): Observable<GetRequestInterface>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .delete<GetRequestInterface>(this.urlBase + '/requests/' + id, { headers })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  // Cities

  // getCities(): Observable<GetCityModel[]> {
  //   return this.http.get<GetCityModel[]>(this.urlBase + '/cities').pipe(
  //     catchError((error) => {
  //       return throwError(() => error);
  //     })
  //   );
  // }

  // getCity(id: string): Observable<GetCityModel> {
  //   return this.http.get<GetCityModel>(`${this.urlBase}/cities/${id}`).pipe(
  //     catchError((error) => {
  //       return throwError(() => error);
  //     })
  //   );
  // }

  // Gammas
  getGammas(): Observable<GetGammaModel[]> {
    return this.http.get<GetGammaModel[]>(this.urlBase + '/gamma').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getGamma(id: string): Observable<GetGammaModel> {
    return this.http.get<GetGammaModel>(this.urlBase + '/gamma/find/' + id).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  //Vehicles

  // Transmissions
  getTransmissions(): Observable<GetTransmissionModel[]> {
    return this.http
      .get<GetTransmissionModel[]>(this.urlBase + '/transmission')
      .pipe(
        catchError((error) => {
          console.error('Error al obtener las transmisiones', error);
          return throwError(() => error);
        })
      );
  }

  getTransmission(id: string): Observable<GetTransmissionModel> {
    return this.http
      .get<GetTransmissionModel>(`${this.urlBase}/transmission/${id}`)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  // Quotes & Answers
  createQuote(quote: PostQuoteInterface): Observable<PostQuoteInterface> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http.post<PostQuoteInterface>(`${this.urlBase}/quotes`, quote, { headers }).pipe(
      catchError((error) => {
        console.error(quote);
        console.error('Error al crear la cotización:', error);
        return throwError(() => error);
      })
    );
  }

  getQuotesWhereRequestId(requestId: string): Observable<GetQuoteInterface[]>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http.get<GetQuoteInterface[]>(`${this.urlBase}/quotes/by-request/` + requestId, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener cotizaciones:', error);
        return throwError(() => error);
      })
    );
  }

  getQuotes(): Observable<GetQuoteInterface[]>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .get<GetQuoteInterface[]>(this.urlBase + '/quotes', { headers })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  getQuote(id: string): Observable<GetQuoteInterface>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .get<GetQuoteInterface>(this.urlBase + '/quotes/' + id, { headers })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  quoteExist(requestId: string, renterId: string): Observable<GetQuoteInterface>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http.get<GetQuoteInterface>(`${this.urlBase}/quotes/requests-with-quote/${requestId}/${renterId}`, { headers }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  deleteQuote(id: string): Observable<GetQuoteInterface>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .delete<GetQuoteInterface>(this.urlBase + '/quotes/' + id, { headers })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  createAnswer(answer: PostAnswerInterface): Observable<PostAnswerInterface>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http.post<PostAnswerInterface>(this.urlBase + '/answers', answer, { headers }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getAnswers(): Observable<GetAnswerInterface[]>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http.get<GetAnswerInterface[]>(this.urlBase + '/answers', { headers }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getAnswersByRequest(requestId: string): Observable<GetAnswerInterface[]>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http.get<GetAnswerInterface[]>(this.urlBase + '/answers/by-request/' + requestId, { headers }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getAnswer(request_id: string, renter_id: string): Observable<GetAnswerInterface>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http.get<GetAnswerInterface>(this.urlBase + '/answers/' + request_id + "/" + renter_id, { headers }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
  // Geolocation
  getCountry(id: number): Observable<GetCountryInterface>
  {
    return this.http.get<GetCountryInterface>(this.urlBase + '/countries/' + id).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );;
  }

  getCountries(): Observable<GetCountryInterface[]>{
    return this.http.get<GetCountryInterface[]>(this.urlBase + '/countries').pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getState(id: number): Observable<GetStateInterface>
  {
    return this.http.get<GetStateInterface>(this.urlBase + '/states/' + id).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getStates(): Observable<GetStateInterface[]>
  {
    return this.http.get<GetStateInterface[]>(this.urlBase + '/states').pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getStatesByCountry(countryId: number): Observable<GetStateInterface[]>
  {
    return this.http.get<GetStateInterface[]>(this.urlBase + '/states/by-country/' + countryId).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getGlobalCity(id: number): Observable<GetCityInterface>
  {
    return this.http.get<GetCityInterface>(this.urlBase + '/global-cities/' + id).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getGlobalCities(): Observable<GetCityInterface[]>
  {
    return this.http.get<GetCityInterface[]>(this.urlBase + '/global-cities').pipe(
      catchError(error => {
        return throwError(() => error);
      })
    )
  }

  getGlobalCitiesByState(stateId: number): Observable<GetCityInterface[]>
  {
    return this.http.get<GetCityInterface[]>(this.urlBase + '/global-cities/by-state/' + stateId).pipe(
    catchError(error => {
      return throwError(() => error);
    })
    );
  }

  getRequestProviderRelations(requestId: string, providerId: string): Observable<GetRequestProviderRelation[]>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http.get<GetRequestProviderRelation[]>(this.urlBase + '/requests-providers/' + requestId + "/" + providerId, { headers }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getRequestsSent(requestId: string): Observable<GetProviderInterface[]>
  {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http.get<GetProviderInterface[]>(this.urlBase + '/requests-providers/' + requestId , { headers }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}
