import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { CategoryGroupState } from './category.group.state';

describe('CategoryGroup store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([CategoryGroupState])],
    });

    store = TestBed.inject(Store);
  });
});
