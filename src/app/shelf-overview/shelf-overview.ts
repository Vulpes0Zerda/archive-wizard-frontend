import { Component, OnInit, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { ApiCallStatus } from '../services/state/ApiCallStatus';
import { AuthState } from '../services/state/auth/auth.state';
import { AuthActions } from '../services/state/auth/auth.actions';

@Component({
  selector: 'app-shelf-overview',
  imports: [RouterLink],
  templateUrl: './shelf-overview.html',
  styleUrl: './shelf-overview.scss',
})
export class ShelfOverview implements OnInit {

  protected readonly API_STATUS_TYPE: typeof ApiCallStatus = ApiCallStatus;
  protected apiStatus: Signal<ApiCallStatus>;

  public constructor(protected store: Store) {
    this.apiStatus = store.selectSignal<ApiCallStatus>(AuthState.getStatus)
  }

  ngOnInit(): void {
    this.loadShelf();
  }

  public logOut() : void {
    this.store.dispatch(new AuthActions.Logout())
  }

  public loadShelf(): void {}

}
