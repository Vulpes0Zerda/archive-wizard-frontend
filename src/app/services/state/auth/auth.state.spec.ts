import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { provideStore, Store } from '@ngxs/store';
import { ApiService } from '../../api/api.service';
import { AuthActions } from './auth.actions';
import { AuthState } from './auth.state';
import { ApiCallStatus } from '../ApiCallStatus';

describe('Auth store', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideStore([AuthState]),
        {
          provide: ApiService,
          useValue: {
            auth: {
              login: () => of({ accessToken: 'test-token' }),
            },
          },
        },
      ],
    });

    store = TestBed.inject(Store);
  });

  it('should finish login after the success action stores the token', async () => {
    await firstValueFrom(
      store.dispatch(
        new AuthActions.Login({ email: 'test@example.com', password: 'password' }),
      ),
    );

    expect(store.selectSnapshot(AuthState.getToken)).toBe('test-token');
    expect(store.selectSnapshot(AuthState.getStatus)).toBe(ApiCallStatus.SUCCESS);
  });
});
