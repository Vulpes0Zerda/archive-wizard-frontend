import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { ApiCallStatus } from '../ApiCallStatus';

export interface AuthStateModel {
  authToken: string | null;
  error: HttpErrorResponse | null;
  status: ApiCallStatus;
}

export const defaultAuthState: AuthStateModel = {
  authToken: null,
  error: null,
  status: ApiCallStatus.IDLE,
};
