import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CategoryGroupStateModel, defaultCategoryGroupState } from './category.group.state.model';
import { CategoryGroup } from '../../model/CategoryGroup';
import { CategoryGroupActions } from './category.group.actions';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ApiCallStatus } from '../ApiCallStatus';
import { ApiService } from '../../api/api.service';
import { HttpResponse } from '@angular/common/http';

@State<CategoryGroupStateModel>({
  name: 'categoryGroup',
  defaults: defaultCategoryGroupState,
})
@Injectable()
export class CategoryGroupState {
  constructor(protected apiService: ApiService) {}
  @Selector()
  public static getStatus(categoryGroupState: CategoryGroupStateModel) {
    return categoryGroupState.status;
  }

  @Selector()
  public static getCurrentCategoryGroups(categoryGroupState: CategoryGroupStateModel) {
    return categoryGroupState.current;
  }

  @Selector()
  public static getAllCategoryGroups(categoryGroupState: CategoryGroupStateModel) {
    return categoryGroupState.list;
  }

  @Selector()
  public static getError(categoryGroupState: CategoryGroupStateModel) {
    return categoryGroupState.error;
  }

  @Action(CategoryGroupActions.FetchAll)
  public fetchAllCategoryGroups(
    categoryGroupContext: StateContext<CategoryGroupStateModel>,
  ): Observable<HttpResponse<CategoryGroup.Response.GetAll> | void> {
    categoryGroupContext.patchState({ status: ApiCallStatus.PENDING, error: null });
    return this.apiService.categoryGroup.getCategoryGroups().pipe(
      tap((response: HttpResponse<CategoryGroup.Response.GetAll>) => {
        categoryGroupContext.setState({
          ...categoryGroupContext.getState(),
          list: response.body ?? [],
          status: ApiCallStatus.SUCCESS,
          error: null,
        });
      }),
      catchError((error) => categoryGroupContext.dispatch(new CategoryGroupActions.Failure(error))),
    );
  }

  @Action(CategoryGroupActions.Failure)
  public failure(
    categoryGroupContext: StateContext<CategoryGroupStateModel>,
    action: CategoryGroupActions.Failure,
  ) {
    categoryGroupContext.setState({
      ...categoryGroupContext.getState(),
      status: ApiCallStatus.FAILURE,
      error: action.error,
      current: null,
      list: [],
    });
    return throwError(() => action.error);
  }
}
