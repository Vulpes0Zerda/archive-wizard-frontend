import { Component, effect, signal, Signal } from '@angular/core';
import { form, FormField, pattern, required } from '@angular/forms/signals';
import { ApiCallStatus } from '../services/state/ApiCallStatus';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { AuthState } from '../services/state/auth/auth.state';
import { AuthActions } from '../services/state/auth/auth.actions';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  templateUrl: './registration.html',
  styleUrl: './registration.scss',
})
export class Registration {
  protected apiStatus: Signal<ApiCallStatus>;
  protected apiError: Signal<HttpErrorResponse | null>;

  constructor(protected store: Store) {
    this.apiStatus = store.selectSignal<ApiCallStatus>(AuthState.getStatus);
    this.apiError = store.selectSignal<HttpErrorResponse | null>(AuthState.getError);
    effect(() => {
      switch (this.apiStatus()) {
        case ApiCallStatus.FAILURE:
          this.registrationModel.update((state) => ({ ...state, password: '' }));
          break;
        case ApiCallStatus.SUCCESS:
          this.registrationModel.set(this.defaultRegistrationModel);
          break;
        case ApiCallStatus.PENDING:
          break;
        default:
          break;
      }
    });
  }

  defaultRegistrationModel = {
    name: '',
    email: '',
    password: '',
  };

  registrationModel = signal(this.defaultRegistrationModel);

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.email);
    pattern(
      schemaPath.email,
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
    );
    required(schemaPath.password);
  });

  onSubmit(event: Event) {
    event.preventDefault();
    this.store.dispatch(new AuthActions.Register(this.registrationModel()));
  }
}
