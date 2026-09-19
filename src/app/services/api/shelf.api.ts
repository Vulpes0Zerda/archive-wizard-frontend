import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shelf } from '../model/Shelf';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ShelfApi {
  constructor(private http: HttpClient) {}

  public getShelfs(): Observable<HttpResponse<Shelf.Response.GetAll>> {
    return this.http.get<HttpResponse<Shelf.Response.GetAll>>(
      `${ApiService.BASE_URL}/shelf-manager/get-overview/`,
      { withCredentials: true },
    );
  }

  public postShelf(
    shelf: Shelf.Request.PostSingle,
  ): Observable<HttpResponse<Shelf.Response.PostSingle>> {
    console.log(shelf);

    return this.http.post<HttpResponse<Shelf.Response.PostSingle>>(
      `${ApiService.BASE_URL}/shelf-manager/create-shelf/`,
      shelf,
      { withCredentials: true },
    );
  }
}
