import { HttpErrorResponse } from '@angular/common/http';
import { Item } from '../../model/Item';
import { ApiCallStatus } from '../ApiCallStatus';

export interface ItemStateModel {
  current: number | null;
  list: Array<Item.Model>;
  error: HttpErrorResponse | null;
  status: ApiCallStatus;
}

export const defaultItemState: ItemStateModel = {
  current: null,
  list: [],
  error: null,
  status: ApiCallStatus.IDLE,
};
