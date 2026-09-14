import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auth } from '../model/Auth';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  constructor(private http: HttpClient) {}

  public register(
    registrationData: Auth.Request.Registration,
  ): Observable<Auth.Response.Registration> {
    return this.http.post<Auth.Response.Registration>(
      `${ApiService.BASE_URL}/auth-manager/register`,
      registrationData,
    );
  }

  public login(loginData: Auth.Request.Login): Observable<Auth.Response.Login> {
    return this.http.post<Auth.Response.Login>(
      `${ApiService.BASE_URL}/auth-manager/login`,
      loginData,
    );
  }

  public refresh(): Observable<HttpErrorResponse> {
    return this.http.post<HttpErrorResponse>(`${ApiService.BASE_URL}/auth-manager/refresh`, null);
  }

  public logout(): Observable<HttpErrorResponse> {
    return this.http.post<HttpErrorResponse>(`${ApiService.BASE_URL}/auth-manager/logout`, null);
  }
}
