import { Component, computed, effect, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { ApiCallStatus } from '../services/state/ApiCallStatus';
import { AuthState } from '../services/state/auth/auth.state';
import { ShelfActions } from '../services/state/shelf/shelf.actions';
import { ShelfState } from '../services/state/shelf/shelf.state';
import { Shelf } from '../services/model/Shelf';
import { AuthActions } from '../services/state/auth/auth.actions';
import { CategoryGroupActions } from '../services/state/categoryGroup/category.group.actions';
import { form, FormField } from '@angular/forms/signals';
import { LogoutSvg } from '../icons/logout-svg/logout-svg';
import { LoginSvg } from '../icons/login-svg/login-svg';

@Component({
  selector: 'app-shelf-overview',
  imports: [RouterLink, FormField, LogoutSvg, LoginSvg],
  templateUrl: './shelf-overview.html',
  styleUrl: './shelf-overview.scss',
  host: {class: "sidebar"}
})
export class ShelfOverview implements OnInit {
  protected readonly API_STATUS_TYPE: typeof ApiCallStatus = ApiCallStatus;
  protected apiStatus: Signal<ApiCallStatus>;
  protected shelfStatus: Signal<ApiCallStatus>;
  protected currentShelf: Signal<Shelf.Model | undefined>;
  protected shelfList: Signal<Array<Shelf.Model>>;
  protected deletePopUpPayload: WritableSignal<number | null>;
  protected pendingShelfDeleteName: Signal<string | undefined>;

  public constructor(
    protected store: Store,
    protected router: Router,
  ) {
    this.apiStatus = store.selectSignal<ApiCallStatus>(AuthState.getStatus);
    this.shelfStatus = store.selectSignal<ApiCallStatus>(ShelfState.getStatus);
    this.shelfList = store.selectSignal<Array<Shelf.Model>>(ShelfState.getAllShelfs);
    this.currentShelf = store.selectSignal<Shelf.Model | undefined>(ShelfState.getCurrentShelf);
    this.deletePopUpPayload = signal(null);
    this.pendingShelfDeleteName = computed(() => {
      return this.shelfList().find((shelf) => shelf.id === this.deletePopUpPayload())?.name;
    });
    effect(() => {
      if (this.apiStatus() === ApiCallStatus.SUCCESS && this.shelfStatus() === ApiCallStatus.IDLE) {
        this.store.dispatch(new ShelfActions.FetchAll());
        this.store.dispatch(new CategoryGroupActions.FetchAll());
      }
      if (this.currentShelf()) {
        this.router.navigate(['/shelf', this.currentShelf()?.id]);
      }
    });
  }

  ngOnInit(): void {}
  public logOut(): void {
    this.store.dispatch(new AuthActions.Logout());
  }

  protected defaultDeleteShelfFormModel: { name: string } = { name: '' };
  protected deleteShelfFormModel: WritableSignal<{ name: string }> = signal(
    this.defaultDeleteShelfFormModel,
  );

  deleteShelfForm = form(this.deleteShelfFormModel);

  public setCurrentShelf(shelfId: number): void {
    this.store.dispatch(new ShelfActions.SetCurrent(shelfId)).subscribe({
      next: () => {
        this.router.navigate(['/shelf', this.currentShelf()?.id]);
      },
      error: () => {},
    });
  }
  public showDeleteConfirmPopUp(shelfId: number): void {
    this.deletePopUpPayload.set(shelfId);
  }

  public deleteShelf(event: Event) {
    event.preventDefault();
    if (this.pendingShelfDeleteName() === this.deleteShelfForm.name().value()) {
      console.log(this.deletePopUpPayload());
      this.store.dispatch(new ShelfActions.DeleteShelf(this.deletePopUpPayload() ?? 0)).subscribe({
        next: (response) => {
          if (!this.currentShelf()) {
            this.router.navigate(['/']);
          }
          this.deleteShelfFormModel.set(this.defaultDeleteShelfFormModel);
          this.deletePopUpPayload.set(null);
        },
        error: () => {
          this.deleteShelfFormModel.set(this.defaultDeleteShelfFormModel);
        },
      });
    } else {
      this.deleteShelfFormModel.set(this.defaultDeleteShelfFormModel);
      //TODO: Add Signal to display failed
    }
  }

  public deleteShelfCancel(event: Event) {
    event.preventDefault();
    this.deletePopUpPayload.set(null);
    this.deleteShelfFormModel.set(this.defaultDeleteShelfFormModel);
  }
}
