import { TestBed } from '@angular/core/testing';
import { CategoryKeyApi } from './category-key.api';

describe('CategoryKeyApi', () => {
  let service: CategoryKeyApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryKeyApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
