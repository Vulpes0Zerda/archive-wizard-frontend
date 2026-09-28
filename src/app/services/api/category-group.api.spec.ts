import { TestBed } from '@angular/core/testing';

import { CategoryGroupApi } from './category-group.api';

describe('CategoryGroupApi', () => {
  let service: CategoryGroupApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryGroupApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
