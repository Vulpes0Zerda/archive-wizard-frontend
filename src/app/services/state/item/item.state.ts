import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { defaultItemState, ItemStateModel } from './item.state.model';
import { ApiService } from '../../api/api.service';
import { ItemActions } from './item.actions';
import { ApiCallStatus } from '../ApiCallStatus';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Item } from '../../model/Item';
import { CategoryValue } from '../../model/CategoryValue';
import { ShelfState } from '../shelf/shelf.state';

@State<ItemStateModel>({
  name: 'item',
  defaults: defaultItemState,
})
@Injectable()
export class ItemState {
  constructor(
    private apiService: ApiService,
    private store: Store,
  ) {}

  @Selector()
  public static getStatus(itemState: ItemStateModel) {
    return itemState.status;
  }

  @Selector()
  public static getCurrentItem(itemState: ItemStateModel) {
    return itemState.list.find((item) => item.id === itemState.current);
  }

  @Selector()
  public static getAllItems(itemState: ItemStateModel) {
    return itemState.list;
  }

  @Selector()
  public static getError(itemState: ItemStateModel) {
    return itemState.error;
  }

  @Action(ItemActions.FetchAll)
  public fetchAllItems(
    itemContext: StateContext<ItemStateModel>,
    action: ItemActions.FetchAll,
  ): Observable<HttpResponse<Item.Response.GetItems> | void> {
    itemContext.patchState({ status: ApiCallStatus.PENDING, error: null });

    return this.apiService.item.getItems(action.shelfId).pipe(
      tap((response) => {
        if (response.body) {
          let listToSpread: Item.Response.GetItems = [...response.body];
          itemContext.setState({
            ...itemContext.getState(),
            status: ApiCallStatus.SUCCESS,
            error: null,
            list: [
              ...itemContext.getState().list.map((item) => {
                const indexOfUpdatedItem = listToSpread.findIndex(
                  (responseItem) => responseItem.id === item.id,
                );
                if (indexOfUpdatedItem !== -1) {
                  const updatedItem: Item.Response.PostSingle = listToSpread[indexOfUpdatedItem];
                  listToSpread.splice(indexOfUpdatedItem, 1);
                  return this.responseToStateMap(updatedItem);
                } else {
                  return item;
                }
              }),
              ...listToSpread.map((item) => this.responseToStateMap(item)),
            ],
          });
        }
      }),
      catchError((error: HttpErrorResponse) =>
        itemContext.dispatch(new ItemActions.Failure(error)),
      ),
    );
  }

  @Action(ItemActions.Failure)
  public failure(
    itemContext: StateContext<ItemStateModel>,
    action: ItemActions.Failure,
  ): Observable<never> {
    itemContext.setState({
      ...itemContext.getState(),
      status: ApiCallStatus.FAILURE,
      error: action.error,
    });
    return throwError(() => action.error);
  }

  @Action(ItemActions.SetCurrent)
  public setCurrent(
    itemContext: StateContext<ItemStateModel>,
    action: ItemActions.SetCurrent,
  ): void {
    if (itemContext.getState().list.findIndex((item) => item.id === action.itemId) !== -1) {
      itemContext.patchState({ current: action.itemId });
    } else {
      itemContext
        .dispatch(
          new ItemActions.FetchAll(this.store.selectSnapshot(ShelfState.getCurrentShelf)?.id ?? 0),
        )
        .subscribe({
          next: () => {
            if (itemContext.getState().list.findIndex((item) => item.id === action.itemId) !== -1) {
              itemContext.patchState({ current: action.itemId });
            }
          },
        });
    }
  }

  @Action(ItemActions.CreateItem)
  public createItem(
    itemContext: StateContext<ItemStateModel>,
    action: ItemActions.CreateItem,
  ): Observable<HttpResponse<Item.Response.PostSingle> | void> {
    itemContext.patchState({ status: ApiCallStatus.PENDING, error: null });
    return this.apiService.item.postItem(action.createItemRequest).pipe(
      tap((response) => {
        const copyItemList: Array<Item.Model> = [...itemContext.getState().list];
        if (response.body) {
          copyItemList.push(this.responseToStateMap(response.body));
        }

        itemContext.setState({
          ...itemContext.getState(),
          current: response.body?.id ?? null,
          list: [...copyItemList],
          status: ApiCallStatus.SUCCESS,
          error: null,
        });
      }),
      catchError((error: HttpErrorResponse) =>
        itemContext.dispatch(new ItemActions.Failure(error)),
      ),
    );
  }

  private responseToStateMap(
    responseItem: Item.Response.PostSingle | Item.Response.GetItems[0],
  ): Item.Model {
    return {
      id: responseItem.id,
      name: responseItem.name,
      picture: responseItem.picture,
      shelfId: responseItem.shelf.id,
      categoryValues: responseItem.categoryValues.map((categoryValue): CategoryValue.State => ({
        id: categoryValue.id,
        value: categoryValue.value,
        categoryKeyId: categoryValue.categoryKey.id,
        //important to use the response item here, as the response json doesn't actually have categoryValue.item.id to prevent recursive loops
        itemId: responseItem.id,
      })),
    };
  }
}
