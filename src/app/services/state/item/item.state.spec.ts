import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { ItemState } from './item.state';
import { defaultItemState } from './item.state.model';
import { ApiService } from '../../api/api.service';
import { CategoryValueState } from '../categoryValue/category-value.state';
import { CategoryValueStateModel } from '../categoryValue/category-value.state.model';
import { ItemActions } from './item.actions';
import { CategoryValue } from '../../model/CategoryValue';
import { firstValueFrom, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

describe('Item store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideStore([ItemState, CategoryValueState]),
        {
          provide: ApiService,
          useValue: {
            item: {
              getItems: () =>
                of(
                  new HttpResponse({
                    body: [
                      {
                        id: 1,
                        name: 'Fetched item',
                        picture: 'picture',
                        shelf: { id: 2, categoryGroupId: 3, name: 'Shelf', position: 0 },
                        categoryValues: [],
                      },
                    ],
                  }),
                ),
            },
          },
        },
      ],
    });

    store = TestBed.inject(Store);
  });

  it('should initialize with the default item state', () => {
    expect(store.selectSnapshot(ItemState.getAllItems)).toEqual(defaultItemState.list);
  });

  it('should fetch and dispatch FillState as an NGXS action instance', async () => {
    await firstValueFrom(store.dispatch(new ItemActions.FetchAll(2)));

    expect(store.selectSnapshot(ItemState.getAllItems)).toEqual([
      { id: 1, name: 'Fetched item', picture: 'picture', shelfId: 2 },
    ]);
  });

  it('should fill both states and replace stale category values for the item', async () => {
    const item = { id: 1, name: 'Item', picture: 'picture', shelfId: 2 };
    const categoryKey = {
      id: 3,
      categoryGroup: { id: 4, name: 'Group' },
      key: 'color',
      position: 0,
    };
    const itemWithValues = {
      ...item,
      shelf: { id: 2, categoryGroupId: 4, name: 'Shelf', position: 0 },
    };
    const staleItem = { id: 7, name: 'Stale', picture: 'stale', shelfId: 2 };
    const otherShelfItem = { id: 8, name: 'Other shelf', picture: 'other', shelfId: 9 };
    const staleItemWithValues = {
      ...staleItem,
      shelf: { id: 2, categoryGroupId: 4, name: 'Shelf', position: 0 },
    };
    const otherShelfItemWithValues = {
      ...otherShelfItem,
      shelf: { id: 9, categoryGroupId: 4, name: 'Other shelf', position: 1 },
    };
    const makeCategoryValue = (id: number, value: string): CategoryValue.Model => ({
      id,
      value,
      item: id === 8 ? otherShelfItemWithValues : id === 7 ? staleItemWithValues : itemWithValues,
      categoryKey,
    });

    await firstValueFrom(
      store.dispatch(
        new ItemActions.FillState(
          [item, staleItem, otherShelfItem],
          [
            makeCategoryValue(5, 'old'),
            makeCategoryValue(6, 'blue'),
            makeCategoryValue(8, 'other shelf value'),
          ],
        ),
      ),
    );
    await firstValueFrom(
      store.dispatch(
        new ItemActions.FillState(
          [item],
          [makeCategoryValue(6, 'green')],
          item.shelfId,
          [item.id, staleItem.id],
        ),
      ),
    );

    expect(store.selectSnapshot(ItemState.getAllItems)).toEqual([otherShelfItem, item]);
    expect(
      store.selectSnapshot(
        (state: { categoryValue: CategoryValueStateModel }) => state.categoryValue.list,
      ),
    ).toEqual([
      { id: 8, value: 'other shelf value', itemId: otherShelfItem.id, categoryKeyId: categoryKey.id },
      { id: 6, value: 'green', itemId: item.id, categoryKeyId: categoryKey.id },
    ]);
  });
});
