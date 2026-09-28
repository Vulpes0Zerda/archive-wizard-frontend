import {
  HttpClient,
  HttpHeaderResponse,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryGroup } from '../model/CategoryGroup';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryGroupApi {
  constructor(private http: HttpClient) {}

  getCategoryGroups(): Observable<HttpResponse<CategoryGroup.Response.GetAll>> {
    return this.http.get<CategoryGroup.Response.GetAll>(
      `${ApiService.BASE_URL}/category-group-manager/get-category-groups`,
      { withCredentials: true, observe: 'response' },
    );
  }

  createCategoryGroup(
    categoryGroup: CategoryGroup.Request.PostSingle,
  ): Observable<HttpResponse<CategoryGroup.Response.PostSingle>> {
    return this.http.post<CategoryGroup.Response.PostSingle>(
      `${ApiService.BASE_URL}/category-group-manager/create-category-group`,
      categoryGroup,
      { withCredentials: true, observe: 'response' },
    );
  }

  deleteCategoryGroup(
    categoryGroup: CategoryGroup.Request.DeleteSingle,
  ): Observable<HttpResponse<null>> {
    return this.http.delete<null>(
      `${ApiService.BASE_URL}/category-group-manager/create-category-group`,
      {
        withCredentials: true,
        observe: 'response',
        params: { categoryGroupId: categoryGroup.id },
      },
    );
  }
}
