import { HttpErrorResponse } from '@angular/common/http';
import { ApiCallStatus } from '../ApiCallStatus';
import { CategoryValue } from '../../model/CategoryValue';

export interface CategoryValueStateModel {
  list: Array<CategoryValue.State>;
  status: ApiCallStatus;
  error: HttpErrorResponse | null;
}

export const defaultCategoryValueState: CategoryValueStateModel = {
  list: new Array<CategoryValue.State>(),
  status: ApiCallStatus.IDLE,
  error: null,
};
