import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetShelf } from '../models/GetShelf';
import { PostShelf } from '../models/PostShelf';
import { PostRegistration } from '../models/PostRegistration';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = "http://localhost:8080" 

  constructor(private http: HttpClient) {}

  //api methods
  public getShelfs(userId: Number): Observable<Array<GetShelf>>{
    console.log( this.http.get<Array<GetShelf>>(`${this.baseUrl}/shelf-manager/get-overview/${userId}`))
    return this.http.get<Array<GetShelf>>(`${this.baseUrl}/shelf-manager/get-overview/${userId}`)
  }

  public postShelf(newShelf : PostShelf): Observable<Array<PostShelf>>{
    return this.http.post<Array<PostShelf>>(`${this.baseUrl}/shelf-manager/create-shelf`, newShelf)
  }

  public postUser(newUser: PostRegistration): Observable<PostRegistration>{
    return this.http.post<PostRegistration>(`${this.baseUrl}/user-manager/register-user`, newUser)
  }
}
