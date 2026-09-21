import { Component, effect, Signal, signal } from '@angular/core';
import { form, FormField, pattern, required } from '@angular/forms/signals';
import { Store } from '@ngxs/store';
import { AuthActions } from '../services/state/auth/auth.actions';
import { AuthState } from '../services/state/auth/auth.state';
import { ApiCallStatus } from '../services/state/ApiCallStatus';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  protected apiStatus: Signal<ApiCallStatus>;
  protected apiError: Signal<HttpErrorResponse | null>;

  constructor(
    protected store: Store,
    protected router: Router,
  ) {
    this.apiStatus = store.selectSignal<ApiCallStatus>(AuthState.getStatus);
    this.apiError = store.selectSignal<HttpErrorResponse | null>(AuthState.getError);
    effect(() => {
      switch (this.apiStatus()) {
        case ApiCallStatus.FAILURE:
          this.loginModel.update((state) => ({ ...state, password: '' }));
          break;
        case ApiCallStatus.SUCCESS:
          this.loginModel.set(this.defaultLoginModel);
          router.navigate(['']);
          break;
        case ApiCallStatus.PENDING:
          break;
        default:
          break;
      }
    });
  }

  defaultLoginModel = {
    email: '',
    password: '',
  };

  loginModel = signal(this.defaultLoginModel);

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email);
    pattern(
      schemaPath.email,
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
    );
    required(schemaPath.password);
  });

  onSubmit(event: Event) {
    event.preventDefault();
    this.store.dispatch(new AuthActions.Login(this.loginModel()));
  }
}
