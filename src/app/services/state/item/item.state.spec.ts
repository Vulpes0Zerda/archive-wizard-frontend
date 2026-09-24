import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { ItemState, ItemStateModel } from './item.state';
import { ItemAction } from './item.actions';

describe('Item store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([ItemState])],
    });

    store = TestBed.inject(Store);
  });

  it('should create an action and add an item', () => {
    const expected: ItemStateModel = {
      items: ['item-1'],
    };
    store.dispatch(new ItemAction('item-1'));
    const actual = store.selectSnapshot(ItemState.getState);
    expect(actual).toEqual(expected);
  });
});
