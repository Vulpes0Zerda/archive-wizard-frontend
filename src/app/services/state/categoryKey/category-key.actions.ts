import { HttpErrorResponse } from '@angular/common/http';

export namespace CategoryKeyActions {
  const ACTION_SCOPE = '[CategoryKey]';
  export class FetchAll {
    static readonly type = `${ACTION_SCOPE} Fetch All`;
    constructor(public readonly categoryGroupId: number) {}
  }

  export class Failure {
    static readonly type = `${ACTION_SCOPE} Set Failure Error`;
    constructor(public error: HttpErrorResponse) {}
  }
}
