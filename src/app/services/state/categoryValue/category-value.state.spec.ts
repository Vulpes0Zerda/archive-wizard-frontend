import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { CategoryValueState } from './category-value.state';

describe('CategoryValue store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([CategoryValueState])],
    });

    store = TestBed.inject(Store);
  });
});
