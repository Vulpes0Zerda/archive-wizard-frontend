import { HttpClient, HttpErrorResponse, HttpHeaderResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthApi } from './auth.api';
import { UserApi } from './user.api';
import { CategoryGroupApi } from './category-group.api';
import { ShelfApi } from './shelf.api';
import { ItemApi } from './item.api';
import { CategoryValueApi } from './category-value.api';
import { CategoryKeyApi } from './category-key.api';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public static BASE_URL = 'http://localhost:8080';

  constructor(
    public readonly auth: AuthApi,
    public readonly user: UserApi,
    public readonly categoryGroup: CategoryGroupApi,
    public readonly shelf: ShelfApi,
    public readonly item: ItemApi,
    public readonly categoryValue: CategoryValueApi,
    public readonly categoryKey: CategoryKeyApi,
  ) {}
}
