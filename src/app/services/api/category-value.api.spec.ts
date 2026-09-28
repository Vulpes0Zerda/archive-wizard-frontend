import { TestBed } from '@angular/core/testing';
import { CategoryValueApi } from './category-value.api';

describe('CategoryValueApi', () => {
  let service: CategoryValueApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryValueApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
