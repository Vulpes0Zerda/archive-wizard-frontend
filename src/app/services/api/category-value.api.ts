import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryValue } from '../model/CategoryValue';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryValueApi {
  constructor(private http: HttpClient) {}
  updateCategoryValues(
    body: CategoryValue.Request.UpdateAll,
  ): Observable<HttpResponse<CategoryValue.Response.UpdateAll>> {
    return this.http.patch<CategoryValue.Response.UpdateAll>(
      `${ApiService.BASE_URL}/category-value-manager/get-category-values`,
      body,
      { withCredentials: true, observe: 'response' },
    );
  }
}
