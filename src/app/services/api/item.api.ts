import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Item } from '../model/Item';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemApi {
  constructor(private http: HttpClient) {}

  public getItems(shelfId: number): Observable<HttpResponse<Item.Response.GetItems>> {
    return this.http.get<Item.Response.GetItems>(
      `${ApiService.BASE_URL}/item-manager/get-all-items`,
      {
        withCredentials: true,
        observe: 'response',
        params: {
          shelfId: shelfId,
        },
      },
    );
  }

  public postItem(
    body: Item.Request.postSingle,
  ): Observable<HttpResponse<Item.Response.PostSingle>> {
    return this.http.post<Item.Response.PostSingle>(
      `${ApiService.BASE_URL}/item-manager/create-item`,
      body,
      {
        withCredentials: true,
        observe: 'response',
      },
    );
  }

  public deleteItem(itemId: number): Observable<HttpResponse<number>> {
    return this.http.delete<number>(`${ApiService.BASE_URL}/item-manager/delete-item`, {
      withCredentials: true,
      observe: 'response',
      params: {
        itemId: itemId,
      },
    });
  }
}
