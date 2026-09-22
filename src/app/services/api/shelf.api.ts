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
    return this.http.get<Shelf.Response.GetAll>(
      `${ApiService.BASE_URL}/shelf-manager/get-overview`,
      { withCredentials: true, observe: 'response' },
    );
  }

  public postShelf(
    shelf: Shelf.Request.PostSingle,
  ): Observable<HttpResponse<Shelf.Response.PostSingle>> {
    return this.http.post<Shelf.Response.PostSingle>(
      `${ApiService.BASE_URL}/shelf-manager/create-shelf`,
      shelf,
      { withCredentials: true, observe: 'response' },
    );
  }

  public deleteShelf(shelfId: Shelf.Request.DeleteShelf): Observable<HttpResponse<null>> {
    return this.http.delete<null>(`${ApiService.BASE_URL}/shelf-manager/delete-shelf`, {
      withCredentials: true,
      observe: 'response',
      params: shelfId,
    });
  }
}
