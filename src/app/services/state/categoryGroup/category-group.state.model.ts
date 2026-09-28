import { HttpErrorResponse } from '@angular/common/http';
import { ApiCallStatus } from '../ApiCallStatus';
import { CategoryGroup } from '../../model/CategoryGroup';

export interface CategoryGroupStateModel {
  current: number | null;
  list: Array<CategoryGroup.Model>;
  status: ApiCallStatus;
  error: HttpErrorResponse | null;
}

export const defaultCategoryGroupState: CategoryGroupStateModel = {
  current: null,
  list: [],
  status: ApiCallStatus.IDLE,
  error: null,
};
