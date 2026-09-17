import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AuthStateModel, defaultAuthState } from './auth.state.model';
import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { ApiCallStatus } from '../ApiCallStatus';
import { AuthActions } from './auth.actions';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Auth } from '../../model/Auth';
import { HttpErrorResponse } from '@angular/common/http';

@State({
  name: 'auth',
  defaults: defaultAuthState,
})
@Injectable()
export class AuthState {
  constructor(public apiService: ApiService) {}

  @Selector()
  public static getToken(authState: AuthStateModel): string | null {
    return authState.authToken;
  }

  @Selector()
  public static getStatus(authState: AuthStateModel): ApiCallStatus {
    return authState.status;
  }

  @Selector()
  public static getError(authState: AuthStateModel): HttpErrorResponse | null {
    return authState.error;
  }

  @Action(AuthActions.Login)
  public login(
    authContext: StateContext<AuthStateModel>,
    action: AuthActions.Login,
  ): Observable<Auth.Response.Login | void> {
    authContext.patchState({ status: ApiCallStatus.PENDING, error: null });
    return this.apiService.auth.login(action.loginRequest).pipe(
      tap((response) => {
        authContext.dispatch(new AuthActions.Success(response.accessToken));
      }),
      catchError((error) => authContext.dispatch(new AuthActions.Failure(error))),
    );
  }

  @Action(AuthActions.Register)
  public register(
    authContext: StateContext<AuthStateModel>,
    action: AuthActions.Register,
  ): Observable<Auth.Response.Registration | void> {
    authContext.patchState({ status: ApiCallStatus.PENDING, error: null });
    return this.apiService.auth.register(action.registrationRequest).pipe(
      tap((response) => {
        authContext.dispatch(new AuthActions.Success(response.accessToken));
      }),
      catchError((error) => authContext.dispatch(new AuthActions.Failure(error))),
    );
  }

  @Action(AuthActions.Refresh)
  public refresh(
    authContext: StateContext<AuthStateModel>,
  ): Observable<Auth.Response.Refresh | void> {
    authContext.patchState({ status: ApiCallStatus.PENDING, error: null });
    return this.apiService.auth.refresh().pipe(
      tap((response) => {
        authContext.dispatch(new AuthActions.Success(response.accessToken));
      }),
      catchError((error) => authContext.dispatch(new AuthActions.Failure(error))),
    );
  }

  @Action(AuthActions.Logout)
  public logout(authContext: StateContext<AuthStateModel>): Observable<HttpErrorResponse> {
    authContext.patchState({ status: ApiCallStatus.PENDING, error: null });
    return this.apiService.auth.logout().pipe(
      tap(() => {
        authContext.setState({
          ...authContext.getState(),
          authToken: null,
          status: ApiCallStatus.IDLE,
          error: null,
        });
      }),
      catchError((error) => {
        authContext.setState({ ...authContext.getState(), error: error });
        return throwError(() => error);
      }),
    );
  }

  @Action(AuthActions.Success)
  public success(authContext: StateContext<AuthStateModel>, action: AuthActions.Success): void {
    return authContext.setState({
      ...authContext.getState(),
      authToken: action.accessToken,
      error: null,
      status: ApiCallStatus.SUCCESS,
    });
  }

  @Action(AuthActions.Failure)
  public failure(
    authContext: StateContext<AuthStateModel>,
    action: AuthActions.Failure,
  ): Observable<never> {
    authContext.setState({
      ...authContext.getState(),
      authToken: null,
      error: action.error,
      status: ApiCallStatus.FAILURE,
    });
    return throwError(() => action.error);
  }
}
