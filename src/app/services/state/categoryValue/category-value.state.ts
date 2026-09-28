import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { CategoryValueActions } from './category-value.actions';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ApiCallStatus } from '../ApiCallStatus';
import { CategoryValueStateModel, defaultCategoryValueState } from './category-value.state.model';
import { CategoryValue } from '../../model/CategoryValue';
import { ApiService } from '../../api/api.service';
import { HttpResponse } from '@angular/common/http';
import { ItemActions } from '../item/item.actions';

@State<CategoryValueStateModel>({
  name: 'categoryValue',
  defaults: defaultCategoryValueState,
})
@Injectable()
export class CategoryValueState {
  constructor(private apiService: ApiService) {}

  @Selector()
  public static getAllCategoryValues(categoryValueState: CategoryValueStateModel) {
    return categoryValueState.list;
  }

  @Action(CategoryValueActions.Failure)
  public failure(
    categoryValueContext: StateContext<CategoryValueStateModel>,
    action: CategoryValueActions.Failure,
  ): Observable<never> {
    categoryValueContext.setState({
      ...categoryValueContext.getState(),
      status: ApiCallStatus.FAILURE,
      error: action.error,
    });
    return throwError(() => action.error);
  }

  @Action(CategoryValueActions.SetLocalValue)
  public setLocalValue(
    categoryValueContext: StateContext<CategoryValueStateModel>,
    action: CategoryValueActions.SetLocalValue,
  ): void {
    const currentList = categoryValueContext.getState().list;
    const matchingIndex = currentList.findIndex(
      (categoryValue) =>
        categoryValue.itemId === action.itemId &&
        categoryValue.categoryKeyId === action.categoryKeyId,
    );
    const updatedValue: CategoryValue.State = {
      id: matchingIndex === -1 ? null : currentList[matchingIndex].id,
      value: action.value,
      itemId: action.itemId,
      categoryKeyId: action.categoryKeyId,
    };

    categoryValueContext.patchState({
      list:
        matchingIndex === -1
          ? [...currentList, updatedValue]
          : currentList.map((value, index) => (index === matchingIndex ? updatedValue : value)),
    });
  }

  @Action(CategoryValueActions.UpdateValues)
  public updatedValues(
    categoryValueContext: StateContext<CategoryValueStateModel>,
    action: CategoryValueActions.UpdateValues,
  ): Observable<HttpResponse<CategoryValue.Response.UpdateAll> | void> {
    categoryValueContext.patchState({ status: ApiCallStatus.PENDING, error: null });
    const valuesToUpdate: CategoryValue.Request.UpdateAll = categoryValueContext
      .getState()
      .list.filter((categoryValue) => categoryValue.itemId === action.itemId)
      .map(({ value, itemId, categoryKeyId }) => ({ value, itemId, categoryKeyId }));
    return this.apiService.categoryValue.updateCategoryValues(valuesToUpdate).pipe(
      tap((response) => {
        categoryValueContext.setState({
          ...categoryValueContext.getState(),
          list: this.mergeValues(
            categoryValueContext.getState().list,
            response.body ?? [],
          ),
          status: ApiCallStatus.SUCCESS,
          error: null,
        });
      }),
      catchError((error) => categoryValueContext.dispatch(new CategoryValueActions.Failure(error))),
    );
  }

  @Action(ItemActions.FillState)
  public fillState(
    categoryValueContext: StateContext<CategoryValueStateModel>,
    action: ItemActions.FillState,
  ): void {
    const currentValues = categoryValueContext.getState().list;
    const replacedItemIds = new Set(action.replacedItemIds);
    const valuesForOtherItems = currentValues.filter(
      (categoryValue) => !replacedItemIds.has(categoryValue.itemId),
    );

    categoryValueContext.setState({
      ...categoryValueContext.getState(),
      list: this.mergeValues(valuesForOtherItems, action.categoryValue),
      status: ApiCallStatus.SUCCESS,
      error: null,
    });
  }

  private mergeValues(
    currentValues: Array<CategoryValue.State>,
    responseValues: Array<CategoryValue.Model>,
  ): Array<CategoryValue.State> {
    const valuesByItemAndKey = new Map(
      currentValues.map((value) => [`${value.itemId}:${value.categoryKeyId}`, value]),
    );

    for (const responseValue of responseValues) {
      const value: CategoryValue.State = {
        id: responseValue.id,
        value: responseValue.value,
        categoryKeyId: responseValue.categoryKey.id,
        itemId: responseValue.item.id,
      };
      valuesByItemAndKey.set(`${value.itemId}:${value.categoryKeyId}`, value);
    }

    return [...valuesByItemAndKey.values()];
  }
}
