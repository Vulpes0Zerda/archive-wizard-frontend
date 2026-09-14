import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shelf } from '../model/Shelf';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ShelfApi {
  constructor(private http: HttpClient) {}

  public getShelfs(): Observable<Shelf.Response.GetAll> {
    return this.http.get<Shelf.Response.GetAll>(
      `${ApiService.BASE_URL}/shelf-manager/get-overview/`,
    );
  }

  public postShelf(newShelf: Shelf.Request.PostSingle): Observable<Shelf.Response.PostSingle> {
    return this.http.post<Shelf.Response.PostSingle>(
      `${ApiService.BASE_URL}/shelf-manager/create-shelf`,
      newShelf,
    );
  }
}
