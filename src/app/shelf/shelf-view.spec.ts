import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Router, provideRouter } from '@angular/router';
import { provideStore, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { ShelfView } from './shelf-view';
import { ShelfState } from '../services/state/shelf/shelf.state';
import { ApiService } from '../services/api/api.service';
import { routes } from '../app.routes';
import { ItemState } from '../services/state/item/item.state';
import { CategoryKeyState } from '../services/state/categoryKey/category-key.state';
import { CategoryValueState } from '../services/state/categoryValue/category-value.state';
import { CategoryKey } from '../services/model/CategoryKey';
import { CategoryValue } from '../services/model/CategoryValue';
import { AuthState } from '../services/state/auth/auth.state';
import { defaultAuthState } from '../services/state/auth/auth.state.model';

describe('ShelfView', () => {
  let component: ShelfView;
  let fixture: ComponentFixture<ShelfView>;
  let store: Store;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelfView],
      providers: [
        provideRouter(routes),
        provideStore([
          AuthState,
          ShelfState,
          ItemState,
          CategoryKeyState,
          CategoryValueState,
        ]),
        {
          provide: ApiService,
          useValue: {
            categoryKey: {
              getCategoryKeys: () =>
                of(new HttpResponse<CategoryKey.Response.GetAll>({ body: [] })),
            },
            categoryValue: {
              updateCategoryValues: () =>
                of(new HttpResponse<CategoryValue.Response.UpdateAll>({ body: [] })),
            },
            item: {
              deleteItem: (itemId: number) =>
                of(new HttpResponse<number>({ body: itemId })),
            },
          },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    store.reset({
      auth: defaultAuthState,
      shelf: {
        current: 2,
        list: [{ id: 2, categoryGroupId: 3, name: 'Shelf', position: 0 }],
        error: null,
        status: 0,
      },
      item: {
        current: null,
        list: [{ id: 10, name: 'Item', picture: '', shelfId: 2 }],
        error: null,
        status: 0,
      },
      categoryKey: { list: [], status: 0, error: null },
      categoryValue: {
        list: [{ id: 4, value: 'Blue', itemId: 10, categoryKeyId: 3 }],
        status: 0,
        error: null,
      },
    });

    fixture = TestBed.createComponent(ShelfView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('conditionally opens item details without changing the shelf URL', async () => {
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-item-view')).not.toBeNull();
    expect(router.url).toBe('/');
  });

  it('conditionally opens the add-item panel without changing the shelf URL', () => {
    const buttons: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('button');
    buttons[buttons.length - 1].click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-add-item')).not.toBeNull();
    expect(router.url).toBe('/');
  });

  it('deletes an item and its category values from state', async () => {
    const deleteButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[aria-label="Delete item Item"]',
    );
    deleteButton.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(store.selectSnapshot(ItemState.getAllItems)).toEqual([]);
    expect(
      store.selectSnapshot(
        (state: { categoryValue: { list: Array<CategoryValue.State> } }) =>
          state.categoryValue.list,
      ),
    ).toEqual([]);
  });
});
