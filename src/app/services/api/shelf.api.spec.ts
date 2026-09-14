import { TestBed } from '@angular/core/testing';

import { ShelfApi } from './shelf.api';

describe('ShelfApi', () => {
  let service: ShelfApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShelfApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
