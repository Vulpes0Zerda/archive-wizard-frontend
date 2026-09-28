import { TestBed } from '@angular/core/testing';
import { ItemApi } from './item.api';

describe('ItemApi', () => {
  let injectable: ItemApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    injectable = TestBed.inject(ItemApi);
  });

  it('should be created', () => {
    expect(injectable).toBeTruthy();
  });
});
