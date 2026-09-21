import { Component, effect, OnInit, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { ApiCallStatus } from '../services/state/ApiCallStatus';
import { AuthState } from '../services/state/auth/auth.state';
import { ShelfActions } from '../services/state/shelf/shelf.actions';
import { ShelfState } from '../services/state/shelf/shelf.state';
import { Shelf } from '../services/model/Shelf';
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
  protected shelfStatus: Signal<ApiCallStatus>;
  protected shelfList: Signal<Array<Shelf.Model>>;

  public constructor(protected store: Store) {
    this.apiStatus = store.selectSignal<ApiCallStatus>(AuthState.getStatus);
    this.shelfStatus = store.selectSignal<ApiCallStatus>(ShelfState.getStatus);
    this.shelfList = store.selectSignal<Array<Shelf.Model>>(ShelfState.getAllShelfs);
    effect(() => {
      if (this.apiStatus() === ApiCallStatus.SUCCESS && this.shelfStatus() === ApiCallStatus.IDLE) {
        this.store.dispatch(new ShelfActions.FetchAll());
      }
    });
  }

  ngOnInit(): void {}
  public logOut(): void {
    this.store.dispatch(new AuthActions.Logout());
  }

  public setCurrentShelf(shelfId: number): void {
    this.store.dispatch(new ShelfActions.SetCurrent(shelfId));
  }

  public addShelf(/* newShelf: Shelf.Request.PostSingle */): void {
    const newShelf: Shelf.Request.PostSingle = {
      name: 'Spellbooks',
      position: 1,
      categoryGroupId: 1,
    };
    this.store.dispatch(new ShelfActions.CreateShelf(newShelf));
  }
}
