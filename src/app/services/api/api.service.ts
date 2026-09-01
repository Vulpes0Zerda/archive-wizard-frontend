import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetShelf } from '../request/GetShelf';
import { PostShelf } from '../request/PostShelf';
import { RegistrationRequest } from '../request/RegistrationRequest';
import { LoginRequest } from '../request/LoginRequest';
import { JwtToken } from '../response/JwtToken';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = "http://localhost:8080" 

  constructor(private http: HttpClient) {}

  //api methods
  public getShelfs(userId: Number): Observable<Array<GetShelf>>{
    return this.http.get<Array<GetShelf>>(`${this.baseUrl}/shelf-manager/get-overview/${userId}`)
  }

  public postShelf(newShelf : PostShelf): Observable<Array<PostShelf>>{
    return this.http.post<Array<PostShelf>>(`${this.baseUrl}/shelf-manager/create-shelf`, newShelf)
  }

  public registration(registrationData: RegistrationRequest): Observable<JwtToken>{
    return this.http.post<JwtToken>(`${this.baseUrl}/auth-manager/register`, registrationData)
  }

  public login(loginData: LoginRequest): Observable<JwtToken>{
    return this.http.post<JwtToken>(`${this.baseUrl}/auth-manager/login`,loginData)
  }

}
