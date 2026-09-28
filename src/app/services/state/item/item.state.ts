import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { defaultItemState, ItemStateModel } from './item.state.model';
import { ApiService } from '../../api/api.service';
import { ItemActions } from './item.actions';
import { ApiCallStatus } from '../ApiCallStatus';
import {
  catchError,
  concatMap,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Item } from '../../model/Item';
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
      concatMap((response) => {
        const replacedItemIds = itemContext
          .getState()
          .list.filter((item) => item.shelfId === action.shelfId)
          .map((item) => item.id);

        return itemContext
          .dispatch(
            this.toFillStateAction(response.body ?? [], action.shelfId, replacedItemIds),
          )
          .pipe(map(() => response));
      }),
      tap((response) => {
        itemContext.patchState({ status: ApiCallStatus.SUCCESS, error: null });
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
  ): Observable<void> {
    if (itemContext.getState().list.findIndex((item) => item.id === action.itemId) !== -1) {
      itemContext.patchState({ current: action.itemId });
      return of(undefined);
    }

    const shelfId = this.store.selectSnapshot(ShelfState.getCurrentShelf)?.id;
    if (shelfId === undefined) {
      return throwError(() => new Error('Cannot fetch items without a current shelf.'));
    }

    return itemContext.dispatch(new ItemActions.FetchAll(shelfId)).pipe(
      concatMap(() => {
        if (itemContext.getState().list.some((item) => item.id === action.itemId)) {
          itemContext.patchState({ current: action.itemId });
          return of(undefined);
        }

        return throwError(() => new Error(`Could not find the item id of ${action.itemId}.`));
      }),
    );
  }

  @Action(ItemActions.CreateItem)
  public createItem(
    itemContext: StateContext<ItemStateModel>,
    action: ItemActions.CreateItem,
  ): Observable<HttpResponse<Item.Response.PostSingle> | void> {
    itemContext.patchState({ status: ApiCallStatus.PENDING, error: null });
    return this.apiService.item.postItem(action.createItemRequest).pipe(
      concatMap((response) => {
        if (!response.body) {
          return throwError(
            () =>
              new HttpErrorResponse({
                error: 'Did not get the created item back.',
                status: 502,
                statusText: 'Missing response body',
              }),
          );
        }

        const createdItem = response.body;
        return itemContext.dispatch(this.toFillStateAction([createdItem])).pipe(
          tap(() => {
            itemContext.patchState({
              current: createdItem.id,
              status: ApiCallStatus.SUCCESS,
              error: null,
            });
          }),
          map(() => response),
        );
      }),
      catchError((error: HttpErrorResponse) =>
        itemContext.dispatch(new ItemActions.Failure(error)),
      ),
    );
  }

  @Action(ItemActions.DeleteItem)
  public deleteItem(
    itemContext: StateContext<ItemStateModel>,
    action: ItemActions.DeleteItem,
  ): Observable<HttpResponse<number> | void> {
    itemContext.patchState({ status: ApiCallStatus.PENDING, error: null });
    return this.apiService.item.deleteItem(action.itemId).pipe(
      concatMap((response) =>
        itemContext
          .dispatch(
            new ItemActions.FillState([], [], undefined, [action.itemId], [action.itemId]),
          )
          .pipe(map(() => response)),
      ),
      catchError((error: HttpErrorResponse) =>
        itemContext.dispatch(new ItemActions.Failure(error)),
      ),
    );
  }

  @Action(ItemActions.FillState)
  public fillState(
    itemContext: StateContext<ItemStateModel>,
    action: ItemActions.FillState,
  ): void {
    const state = itemContext.getState();
    const removedItemIds = new Set(action.removedItemIds);
    const retainedItems = state.list.filter(
      (item) =>
        !removedItemIds.has(item.id) &&
        (action.replaceShelfId === undefined || item.shelfId !== action.replaceShelfId),
    );
    const itemsById = new Map(retainedItems.map((item) => [item.id, item]));

    for (const item of action.items) {
      itemsById.set(item.id, item);
    }

    itemContext.patchState({
      list: [...itemsById.values()],
      current: state.current !== null && removedItemIds.has(state.current) ? null : state.current,
      status: ApiCallStatus.SUCCESS,
      error: null,
    });
  }

  private toFillStateAction(
    responseItems: Array<Item.Response.PostSingle | Item.Response.GetItems[0]>,
    replaceShelfId?: number,
    replacedItemIds: Array<number> = [],
  ): ItemActions.FillState {
    return new ItemActions.FillState(
      responseItems.map((responseItem) => ({
        id: responseItem.id,
        name: responseItem.name,
        picture: responseItem.picture,
        shelfId: responseItem.shelf.id,
      })),
      responseItems.flatMap((responseItem) =>
        responseItem.categoryValues.map((categoryValue) => ({
          ...categoryValue,
          itemId: responseItem.id,
        })),
      ),
      replaceShelfId,
      replacedItemIds,
    );
  }
}
