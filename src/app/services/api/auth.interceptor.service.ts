import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthState } from '../state/auth/auth.state';
import { AuthActions } from '../state/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store) {}

  // handles expired auth tokens while session is running. Maybe not the best pattern as it takes longer
  // TODO: maybe replace this with the backend handeling an automatic check on refresh once accessToken has expired
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.store.selectSnapshot<string | null>(AuthState.getToken);
    const authRequest = authToken
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${authToken}`,
          },
        })
      : req;
    console.log(authRequest);
    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          return this.store.dispatch(new AuthActions.Refresh()).pipe(
            switchMap(() => {
              const newAuthToken = this.store.selectSnapshot<string | null>(AuthState.getToken);
              return next.handle(
                req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newAuthToken}`,
                  },
                }),
              );
            }),
            catchError((error) => throwError(() => error)),
          );
        }
        return throwError(() => error);
      }),
    );
  }
}
