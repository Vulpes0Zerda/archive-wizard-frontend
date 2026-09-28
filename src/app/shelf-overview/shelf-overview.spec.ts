import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideStore, Store } from '@ngxs/store';
import { firstValueFrom, of } from 'rxjs';
import { ApiService } from '../services/api/api.service';
import { AuthActions } from '../services/state/auth/auth.actions';
import { AuthState } from '../services/state/auth/auth.state';
import { defaultAuthState } from '../services/state/auth/auth.state.model';
import { CategoryGroupState } from '../services/state/categoryGroup/category.group.state';
import { Shelf } from '../services/model/Shelf';
import { CategoryGroup } from '../services/model/CategoryGroup';
import { ShelfState } from '../services/state/shelf/shelf.state';
import { ShelfOverview } from './shelf-overview';
import { ApiCallStatus } from '../services/state/ApiCallStatus';

describe('ShelfOverview', () => {
  let fixture: ComponentFixture<ShelfOverview>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelfOverview],
      providers: [
        provideRouter([]),
        provideStore([AuthState, ShelfState, CategoryGroupState]),
        {
          provide: ApiService,
          useValue: {
            shelf: {
              getShelfs: () =>
                of(
                  new HttpResponse<Shelf.Response.GetAll>({
                    body: [
                      {
                        id: 2,
                        name: 'Shelf',
                        position: 0,
                        categoryGroup: { id: 3, name: 'Group' },
                      },
                    ],
                  }),
                ),
            },
            categoryGroup: {
              getCategoryGroups: () =>
                of(
                  new HttpResponse<CategoryGroup.Response.GetAll>({
                    body: [{ id: 3, name: 'Group' }],
                  }),
                ),
            },
          },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    store.reset({
      auth: defaultAuthState,
      shelf: {
        current: null,
        list: [],
        status: ApiCallStatus.FAILURE,
        error: null,
      },
    });
    fixture = TestBed.createComponent(ShelfOverview);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('loads shelves after auth succeeds when shelf status is already failure', async () => {
    await firstValueFrom(store.dispatch(new AuthActions.Success('access-token')));
    await fixture.whenStable();

    expect(store.selectSnapshot(ShelfState.getAllShelfs)).toEqual([
      {
        id: 2,
        name: 'Shelf',
        position: 0,
        categoryGroupId: 3,
        categoryGroup: { id: 3, name: 'Group' },
      },
    ]);
  });
});
