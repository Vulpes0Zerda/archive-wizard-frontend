import { HttpErrorResponse } from '@angular/common/http';
import { ApiCallStatus } from '../ApiCallStatus';
import { CategoryKey } from '../../model/CategoryKey';

export interface CategoryKeyStateModel {
  list: Array<CategoryKey.Model>;
  status: ApiCallStatus;
  error: HttpErrorResponse | null;
}

export const defaultCategoryKeyState: CategoryKeyStateModel = {
  list: [],
  status: ApiCallStatus.IDLE,
  error: null,
};
