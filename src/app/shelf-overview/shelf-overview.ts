import { Component, effect, OnInit, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { ApiCallStatus } from '../services/state/ApiCallStatus';
import { AuthState } from '../services/state/auth/auth.state';
import { ShelfActions } from '../services/state/shelf/shelf.actions';
import { ShelfState } from '../services/state/shelf/shelf.state';
import { ShelfStateModel } from '../services/state/shelf/shelf.state.model';
import { Shelf } from '../services/model/Shelf';

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
  protected shelfList: Signal<Array<Shelf.Model> | null>;

  public constructor(protected store: Store) {
    this.apiStatus = store.selectSignal<ApiCallStatus>(AuthState.getStatus);
    this.shelfStatus = store.selectSignal<ApiCallStatus>(ShelfState.getStatus);
    this.shelfList = store.selectSignal<Array<Shelf.Model> | null>(ShelfState.getAllShelfs);
    effect(() => {
      if (this.apiStatus() === ApiCallStatus.SUCCESS && this.shelfStatus() === ApiCallStatus.IDLE) {
        this.store.dispatch(new ShelfActions.FetchAll());
      }
    });
  }

  ngOnInit(): void {
    this.loadShelf();
  }

  public loadShelf(): void {
    if (this.apiStatus() === ApiCallStatus.SUCCESS) {
      this.store.dispatch(new ShelfActions.FetchAll());
    }
  }

  public setCurrentShelf(shelfId: number): void {
    this.store.dispatch(new ShelfActions.SetCurrent(shelfId));
  }

  public addShelf(newShelf: Shelf.Request.PostSingle): void {
    this.store.dispatch(new ShelfActions.CreateShelf(newShelf));
  }
}
