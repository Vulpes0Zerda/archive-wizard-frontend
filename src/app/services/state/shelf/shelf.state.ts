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
    return shelfState.current;
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
      current: null,
      list: [],
      status: ApiCallStatus.FAILURE,
      error: action.error,
    });
    return throwError(() => action.error);
  }

  @Action(ShelfActions.SetCurrent)
  public setCurrent(
    shelfContext: StateContext<ShelfStateModel>,
    action: ShelfActions.SetCurrent,
  ): void {
    shelfContext.patchState({ current: action.shelfId });
    //TODO: Dispatch action to fetch all items in the shelf
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
}
