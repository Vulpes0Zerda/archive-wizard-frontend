import { Component, effect, OnInit, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { ApiCallStatus } from '../services/state/ApiCallStatus';
import { CategoryGroupStateModel } from '../services/state/categoryGroup/category.group.state.model';
import { CategoryGroupState } from '../services/state/categoryGroup/category.group.state';
import { CategoryGroup } from '../services/model/CategoryGroup';
import { AuthState } from '../services/state/auth/auth.state';
import { ShelfState } from '../services/state/shelf/shelf.state';
import { CategoryGroupActions } from '../services/state/categoryGroup/category.group.actions';

@Component({
  selector: 'app-create-shelf',
  imports: [],
  templateUrl: './create-shelf.html',
  styleUrl: './create-shelf.scss',
})
export class CreateShelf implements OnInit {
  protected apiStatus: Signal<ApiCallStatus>;
  protected shelfStatus: Signal<ApiCallStatus>;
  protected categoryGroups: Signal<Array<CategoryGroup.Model>>;

  constructor(protected readonly store: Store) {
    this.apiStatus = store.selectSignal<ApiCallStatus>(AuthState.getStatus);
    this.shelfStatus = store.selectSignal<ApiCallStatus>(ShelfState.getStatus);
    this.categoryGroups = store.selectSignal<Array<CategoryGroup.Model>>(
      CategoryGroupState.getAllCategoryGroups,
    );
  }

  ngOnInit(): void {
    this.store.dispatch(new CategoryGroupActions.FetchAll());
  }
}
