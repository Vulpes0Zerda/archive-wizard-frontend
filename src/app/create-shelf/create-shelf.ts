import { Component, effect, OnInit, signal, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { ApiCallStatus } from '../services/state/ApiCallStatus';
import { CategoryGroupStateModel } from '../services/state/categoryGroup/category.group.state.model';
import { CategoryGroupState } from '../services/state/categoryGroup/category.group.state';
import { CategoryGroup } from '../services/model/CategoryGroup';
import { AuthState } from '../services/state/auth/auth.state';
import { ShelfState } from '../services/state/shelf/shelf.state';
import { CategoryGroupActions } from '../services/state/categoryGroup/category.group.actions';
import { form, FormField, required } from '@angular/forms/signals';
import { ShelfActions } from '../services/state/shelf/shelf.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-shelf',
  imports: [FormField],
  templateUrl: './create-shelf.html',
  styleUrl: './create-shelf.scss',
})
export class CreateShelf implements OnInit {
  protected apiStatus: Signal<ApiCallStatus>;
  protected shelfStatus: Signal<ApiCallStatus>;
  protected categoryGroups: Signal<Array<CategoryGroup.Model>>;
  protected currentShelf: Signal<number | null>;

  constructor(
    protected readonly store: Store,
    protected readonly router: Router,
  ) {
    this.apiStatus = store.selectSignal<ApiCallStatus>(AuthState.getStatus);
    this.shelfStatus = store.selectSignal<ApiCallStatus>(ShelfState.getStatus);
    this.categoryGroups = store.selectSignal<Array<CategoryGroup.Model>>(
      CategoryGroupState.getAllCategoryGroups,
    );
    this.currentShelf = store.selectSignal<number | null>(ShelfState.getCurrentShelf);
  }

  ngOnInit(): void {
    this.store.dispatch(new CategoryGroupActions.FetchAll());
  }

  defaultCreateShelfModel = {
    name: '',
    position: 0,
    categoryGroupId: '',
  };

  createShelfModel = signal(this.defaultCreateShelfModel);

  shelfForm = form(this.createShelfModel, (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.categoryGroupId);
  });

  protected onSubmit(event: Event) {
    event.preventDefault();
    //TODO: Replace this with an actually good positioning strategy
    const shelfPosition = this.store.selectSnapshot(ShelfState.getAllShelfs).length;
    this.createShelfModel.update((createShelfState) => ({
      ...createShelfState,
      position: shelfPosition,
    }));
    this.store
      .dispatch(
        new ShelfActions.CreateShelf({
          ...this.createShelfModel(),
          categoryGroupId: Number(this.createShelfModel().categoryGroupId),
        }),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/shelf', this.currentShelf()]);
        },
      });
  }

  protected onCancel(event: Event) {
    event.preventDefault();
    this.createShelfModel.set(this.defaultCreateShelfModel);
    this.router.navigate(['']);
  }
}
