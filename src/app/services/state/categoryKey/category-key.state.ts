import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { CategoryKeyActions } from './category-key.actions';
import { CategoryKeyStateModel, defaultCategoryKeyState } from './category-key.state.model';
import { ApiCallStatus } from '../ApiCallStatus';
import { ApiService } from '../../api/api.service';
import { catchError, tap, throwError } from 'rxjs';
import { CategoryKey } from '../../model/CategoryKey';

@State<CategoryKeyStateModel>({
  name: 'categoryKey',
  defaults: defaultCategoryKeyState,
})
@Injectable()
export class CategoryKeyState {
  constructor(protected apiService: ApiService) {}

  @Selector()
  public static getAllCategoryKeys(categoryKeyState: CategoryKeyStateModel) {
    return categoryKeyState.list;
  }

  @Selector()
  public static getStatus(categoryKeyState: CategoryKeyStateModel) {
    return categoryKeyState.status;
  }

  @Selector()
  public static getError(categoryKeyState: CategoryKeyStateModel) {
    return categoryKeyState.error;
  }

  @Action(CategoryKeyActions.FetchAll)
  public fetchAll(
    categoryKeyContext: StateContext<CategoryKeyStateModel>,
    action: CategoryKeyActions.FetchAll,
  ) {
    categoryKeyContext.patchState({ status: ApiCallStatus.PENDING, error: null });
    return this.apiService.categoryKey.getCategoryKeys(action.categoryGroupId).pipe(
      tap((response) => {
        const currentList = categoryKeyContext.getState().list;
        const existingKeysForOtherGroups = currentList.filter(
          (categoryKey) => categoryKey.categoryGroup.id !== action.categoryGroupId,
        );

        categoryKeyContext.setState({
          ...categoryKeyContext.getState(),
          list: [...existingKeysForOtherGroups, ...(response.body ?? [])],
          status: ApiCallStatus.SUCCESS,
          error: null,
        });
      }),
      catchError((error) => categoryKeyContext.dispatch(new CategoryKeyActions.Failure(error))),
    );
  }

  @Action(CategoryKeyActions.Failure)
  public failure(
    categoryKeyContext: StateContext<CategoryKeyStateModel>,
    action: CategoryKeyActions.Failure,
  ) {
    categoryKeyContext.setState({
      ...categoryKeyContext.getState(),
      status: ApiCallStatus.FAILURE,
      error: action.error,
      list: [],
    });
    return throwError(() => action.error);
  }
}
