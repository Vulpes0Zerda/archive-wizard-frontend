import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CategoryValue } from '../model/CategoryValue';
import { ApiService } from './api.service';
import { CategoryValueApi } from './category-value.api';

describe('CategoryValueApi', () => {
  let service: CategoryValueApi;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CategoryValueApi);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should update category values at the update endpoint', () => {
    const values: CategoryValue.Request.UpdateAll = [
      { value: 'blue', itemId: 10, categoryKeyId: 3 },
    ];

    service.updateCategoryValues(values).subscribe();

    const request = httpTestingController.expectOne(
      `${ApiService.BASE_URL}/category-value-manager/update-category-values`,
    );
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual(values);
    expect(request.request.withCredentials).toBe(true);
    request.flush([]);
  });
});
