import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/User';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  constructor(private http: HttpClient) {}

  public getName(): Observable<User.Response.GetName> {
    return this.http.get<User.Response.GetName>(`${ApiService.BASE_URL}/user-manager/get-name`);
  }
}
