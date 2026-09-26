import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { ShelfActions } from './shelf.actions';
import { defaultShelfState, ShelfStateModel } from './shelf.state.model';
import { ApiService } from '../../api/api.service';
import { ApiCallStatus } from '../ApiCallStatus';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Shelf } from '../../model/Shelf';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { append, patch, safePatch } from '@ngxs/store/operators';
import { CategoryGroup } from '../../model/CategoryGroup';
import { ItemActions } from '../item/item.actions';
import { Item } from '../../model/Item';

@State<ShelfStateModel>({
  name: 'shelf',
  defaults: defaultShelfState,
})
@Injectable()
export class ShelfState {
  constructor(private apiService: ApiService) {}
  @Selector()
  public static getStatus(shelfState: ShelfStateModel) {
    return shelfState.status;
  }

  @Selector()
  public static getCurrentShelf(shelfState: ShelfStateModel) {
    return shelfState.list.find((shelf) => shelf.id === shelfState.current);
  }

  @Selector()
  public static getAllShelfs(shelfState: ShelfStateModel) {
    return shelfState.list;
  }

  @Selector()
  public static getError(shelfState: ShelfStateModel) {
    return shelfState.error;
  }

  @Action(ShelfActions.FetchAll)
  public fetchAllShelfs(
    shelfContext: StateContext<ShelfStateModel>,
  ): Observable<HttpResponse<Shelf.Response.GetAll> | void> {
    shelfContext.patchState({ status: ApiCallStatus.PENDING, error: null });
    return this.apiService.shelf.getShelfs().pipe(
      tap((response) => {
        if (response.body) {
          shelfContext.setState({
            ...shelfContext.getState(),
            status: ApiCallStatus.SUCCESS,
            list: [
              ...response.body.map<Shelf.Model>((shelf): Shelf.Model => ({
                ...shelf,
                categoryGroupId: shelf.categoryGroup.id,
              })),
            ],
            error: null,
          });
        }
      }),
      catchError((error: HttpErrorResponse) =>
        shelfContext.dispatch(new ShelfActions.Failure(error)),
      ),
    );
  }

  @Action(ShelfActions.Failure)
  public failure(
    shelfContext: StateContext<ShelfStateModel>,
    action: ShelfActions.Failure,
  ): Observable<never> {
    shelfContext.setState({
      ...shelfContext.getState(),
      status: ApiCallStatus.FAILURE,
      error: action.error,
    });
    return throwError(() => action.error);
  }

  @Action(ShelfActions.SetCurrent)
  public setCurrent(
    shelfContext: StateContext<ShelfStateModel>,
    action: ShelfActions.SetCurrent,
  ): Observable<HttpResponse<Item.Response.GetItems> | void> {
    if (shelfContext.getState().list.findIndex((shelf) => shelf.id === action.shelfId) !== -1) {
      shelfContext.patchState({ current: action.shelfId });
      return shelfContext.dispatch(new ItemActions.FetchAll(shelfContext.getState().current ?? 0));
    } else {
      return new Observable<void>();
    }
  }

  @Action(ShelfActions.CreateShelf)
  public createShelf(
    shelfContext: StateContext<ShelfStateModel>,
    action: ShelfActions.CreateShelf,
  ): Observable<HttpResponse<Shelf.Response.PostSingle> | void> {
    shelfContext.patchState({ status: ApiCallStatus.PENDING, error: null });
    return this.apiService.shelf.postShelf(action.createShelfRequest).pipe(
      tap((response) => {
        const copyShelfList: Array<Shelf.Model> = [...shelfContext.getState().list];

        if (response.body) {
          copyShelfList.push({ ...response.body, categoryGroupId: response.body.categoryGroup.id });
        }

        shelfContext.setState({
          ...shelfContext.getState(),
          current: response.body?.id ?? null,
          list: [...copyShelfList],
          status: ApiCallStatus.SUCCESS,
          error: null,
        });
      }),
      catchError((error: HttpErrorResponse) =>
        shelfContext.dispatch(new ShelfActions.Failure(error)),
      ),
    );
  }

  @Action(ShelfActions.DeleteShelf)
  public deleteShelf(
    shelfContext: StateContext<ShelfStateModel>,
    action: ShelfActions.DeleteShelf,
  ): Observable<HttpResponse<number> | void> {
    shelfContext.patchState({ status: ApiCallStatus.PENDING, error: null });
    return this.apiService.shelf.deleteShelf(action.shelfId).pipe(
      tap((response) => {
        const deletedShelfId = response.body;
        const updatedShelfList = shelfContext
          .getState()
          .list.filter((shelf) => shelf.id !== deletedShelfId);

        shelfContext.setState({
          ...shelfContext.getState(),
          list: updatedShelfList,
          current:
            shelfContext.getState().current === deletedShelfId
              ? null
              : shelfContext.getState().current,
          status: ApiCallStatus.SUCCESS,
          error: null,
        });
      }),
      catchError((error: HttpErrorResponse) =>
        shelfContext.dispatch(new ShelfActions.Failure(error)),
      ),
    );
  }
}
