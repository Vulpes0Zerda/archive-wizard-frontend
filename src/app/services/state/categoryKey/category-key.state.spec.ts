import { HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { ApiService } from '../../api/api.service';
import { CategoryKey } from '../../model/CategoryKey';
import { ApiCallStatus } from '../ApiCallStatus';
import { provideStore, Store } from '@ngxs/store';
import { CategoryKeyActions } from './category-key.actions';
import { CategoryKeyState } from './category-key.state';

describe('CategoryKey store', () => {
  let store: Store;
  let responseBody: CategoryKey.Response.GetAll | null;

  beforeEach(() => {
    responseBody = [];
    TestBed.configureTestingModule({
      providers: [
        provideStore([CategoryKeyState]),
        {
          provide: ApiService,
          useValue: {
            categoryKey: {
              getCategoryKeys: () =>
                of(new HttpResponse<CategoryKey.Response.GetAll>({ body: responseBody })),
            },
          },
        },
      ],
    });

    store = TestBed.inject(Store);
  });

  it('replaces keys for the fetched group and preserves keys for other groups', async () => {
    const existingGroupKey = {
      id: 1,
      categoryGroup: { id: 10, name: 'Group 10' },
      key: 'old',
      position: 0,
    };
    const otherGroupKey = {
      id: 2,
      categoryGroup: { id: 20, name: 'Group 20' },
      key: 'other',
      position: 0,
    };
    const fetchedGroupKey = {
      id: 3,
      categoryGroup: { id: 10, name: 'Group 10' },
      key: 'new',
      position: 1,
    };

    store.reset({
      categoryKey: {
        list: [existingGroupKey, otherGroupKey],
        status: ApiCallStatus.IDLE,
        error: null,
      },
    });
    responseBody = [fetchedGroupKey];

    await firstValueFrom(store.dispatch(new CategoryKeyActions.FetchAll(10)));

    expect(store.selectSnapshot(CategoryKeyState.getAllCategoryKeys)).toEqual([
      otherGroupKey,
      fetchedGroupKey,
    ]);
    expect(store.selectSnapshot(CategoryKeyState.getStatus)).toBe(ApiCallStatus.SUCCESS);
  });

  it('treats a null response body as an empty list for the fetched group', async () => {
    const existingGroupKey: CategoryKey.Model = {
      id: 1,
      categoryGroup: { id: 10, name: 'Group 10' },
      key: 'old',
      position: 0,
    };

    store.reset({
      categoryKey: {
        list: [existingGroupKey],
        status: ApiCallStatus.IDLE,
        error: null,
      },
    });
    responseBody = null;

    await firstValueFrom(store.dispatch(new CategoryKeyActions.FetchAll(10)));

    expect(store.selectSnapshot(CategoryKeyState.getAllCategoryKeys)).toEqual([]);
    expect(store.selectSnapshot(CategoryKeyState.getStatus)).toBe(ApiCallStatus.SUCCESS);
  });
});
