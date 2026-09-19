import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { ShelfState, ShelfStateModel } from './shelf.state';
import { ShelfAction } from './shelf.actions';

describe('Shelf store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([ShelfState])],
    });

    store = TestBed.inject(Store);
  });

  it('should create an action and add an item', () => {
    const expected: ShelfStateModel = {
      items: ['item-1'],
    };
    store.dispatch(new ShelfAction('item-1'));
    const actual = store.selectSnapshot(ShelfState.getState);
    expect(actual).toEqual(expected);
  });
});
