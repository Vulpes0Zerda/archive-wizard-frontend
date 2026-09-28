import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryKey } from '../model/CategoryKey';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryKeyApi {
  constructor(private http: HttpClient) {}

  getCategoryKeys(categoryGroupId: number): Observable<HttpResponse<CategoryKey.Response.GetAll>> {
    return this.http.get<CategoryKey.Response.GetAll>(
      `${ApiService.BASE_URL}/category-key-manager/get-category-keys`,
      { withCredentials: true, observe: 'response', params: { categoryGroupId: categoryGroupId } },
    );
  }
}
