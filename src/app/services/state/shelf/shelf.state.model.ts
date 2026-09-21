import { HttpErrorResponse } from '@angular/common/http';
import { Shelf } from '../../model/Shelf';
import { ApiCallStatus } from '../ApiCallStatus';

export interface ShelfStateModel {
  current: Shelf.Model['id'] | null;
  list: Array<Shelf.Model>;
  error: HttpErrorResponse | null;
  status: ApiCallStatus;
}

export const defaultShelfState: ShelfStateModel = {
  current: null,
  list: [],
  error: null,
  status: ApiCallStatus.IDLE,
};
