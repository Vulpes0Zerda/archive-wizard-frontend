import { HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { ApiService } from '../services/api/api.service';
import { routes } from '../app.routes';
import { CategoryKey } from '../services/model/CategoryKey';
import { CategoryValue } from '../services/model/CategoryValue';
import { CategoryKeyState } from '../services/state/categoryKey/category-key.state';
import { CategoryValueState } from '../services/state/categoryValue/category-value.state';
import { ItemState } from '../services/state/item/item.state';
import { ShelfState } from '../services/state/shelf/shelf.state';
import { ItemView } from './item-view';

describe('ItemView', () => {
  let fixture: ComponentFixture<ItemView>;
  let store: Store;
  let updateCalls: CategoryValue.Request.UpdateAll[];

  const categoryKey: CategoryKey.Model = {
    id: 3,
    categoryGroup: { id: 7, name: 'Details' },
    key: 'Color',
    position: 0,
  };

  beforeEach(async () => {
    updateCalls = [];
    await TestBed.configureTestingModule({
      imports: [ItemView],
      providers: [
        provideRouter(routes),
        provideStore([ItemState, ShelfState, CategoryKeyState, CategoryValueState]),
        {
          provide: ApiService,
          useValue: {
            categoryKey: {
              getCategoryKeys: () =>
                of(new HttpResponse<CategoryKey.Response.GetAll>({ body: [categoryKey] })),
            },
            categoryValue: {
              updateCategoryValues: (values: CategoryValue.Request.UpdateAll) => {
                updateCalls.push(values);
                return of(
                  new HttpResponse<CategoryValue.Response.UpdateAll>({ body: [] }),
                );
              },
            },
          },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    store.reset({
      item: {
        current: 5,
        list: [{ id: 5, name: 'Item', picture: '', shelfId: 2 }],
        error: null,
        status: 0,
      },
      shelf: {
        current: 2,
        list: [{ id: 2, categoryGroupId: 7, name: 'Shelf', position: 0 }],
        error: null,
        status: 0,
      },
      categoryKey: { list: [], error: null, status: 0 },
      categoryValue: { list: [], error: null, status: 0 },
    });

    fixture = TestBed.createComponent(ItemView);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('stores each input immediately and saves the item values on Enter', async () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.labels?.[0]?.textContent).toContain('Color');

    input.value = 'Blue';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(
      store.selectSnapshot(
        (state: { categoryValue: { list: CategoryValue.State[] } }) =>
          state.categoryValue.list,
      ),
    ).toEqual([{ id: null, value: 'Blue', itemId: 5, categoryKeyId: 3 }]);

    input.form?.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();

    expect(updateCalls).toEqual([[{ value: 'Blue', itemId: 5, categoryKeyId: 3 }]]);
  });

  it('saves pending edits when the item view is destroyed', async () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'Green';
    input.dispatchEvent(new Event('input'));

    fixture.destroy();
    await fixture.whenStable();

    expect(updateCalls).toEqual([[{ value: 'Green', itemId: 5, categoryKeyId: 3 }]]);
  });
});
