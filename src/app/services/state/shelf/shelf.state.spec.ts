import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { ShelfState } from './shelf.state';
import { ApiService } from '../../api/api.service';
import { HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { Shelf } from '../../model/Shelf';
import { ApiCallStatus } from '../ApiCallStatus';
import { firstValueFrom } from 'rxjs';
import { ShelfActions } from './shelf.actions';

describe('Shelf store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideStore([ShelfState]),
        {
          provide: ApiService,
          useValue: {
            shelf: {
              getShelfs: () =>
                of(new HttpResponse<Shelf.Response.GetAll>({ body: null })),
            },
          },
        },
      ],
    });

    store = TestBed.inject(Store);
  });

  it('should complete an empty fetch and clear the current shelf', async () => {
    store.reset({
      shelf: {
        current: 1,
        list: [{ id: 1, name: 'Shelf', categoryGroupId: 2, position: 0 }],
        status: ApiCallStatus.IDLE,
        error: null,
      },
    });

    await firstValueFrom(store.dispatch(new ShelfActions.FetchAll()));

    expect(store.selectSnapshot(ShelfState.getStatus)).toBe(ApiCallStatus.SUCCESS);
    expect(store.selectSnapshot(ShelfState.getAllShelfs)).toEqual([]);
    expect(store.selectSnapshot(ShelfState.getCurrentShelf)).toBeUndefined();
  });
});
