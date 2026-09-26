import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { ItemState } from './item.state';
import { defaultItemState } from './item.state.model';
import { ApiService } from '../../api/api.service';

describe('Item store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([ItemState]), { provide: ApiService, useValue: {} }],
    });

    store = TestBed.inject(Store);
  });

  it('should initialize with the default item state', () => {
    expect(store.selectSnapshot(ItemState.getAllItems)).toEqual(defaultItemState.list);
  });
});
