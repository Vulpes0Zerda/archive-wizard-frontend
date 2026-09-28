import { HttpErrorResponse } from '@angular/common/http';
import { CategoryGroup } from '../../model/CategoryGroup';

export namespace CategoryGroupActions {
  const ACTION_SCOPE = '[CategoryGroup]';
  export class FetchAll {
    static readonly type = `${ACTION_SCOPE} Fetch All`;
    constructor() {}
  }

  export class Failure {
    static readonly type = `${ACTION_SCOPE} Set Failure Error`;
    constructor(public error: HttpErrorResponse) {}
  }

  export class PostSingle {
    static readonly type = `${ACTION_SCOPE} Post Single`;
    //TODO: add request model and fitting constructor attributes
    constructor(public categoryGroup: CategoryGroup.Request.PostSingle) {}
  }
}
