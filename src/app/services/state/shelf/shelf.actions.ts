import { HttpErrorResponse } from '@angular/common/http';
import { Shelf } from '../../model/Shelf';

export namespace ShelfActions {
  const ACTION_SCOPE = '[SHELF]';
  export class FetchAll {
    static readonly type = `${ACTION_SCOPE} Fetch Shelf List`;
    constructor() {}
  }

  export class CreateShelf {
    static readonly type = `${ACTION_SCOPE} Post Created Shelf`;
    constructor(public readonly createShelfRequest: Shelf.Request.PostSingle) {}
  }

  export class Failure {
    static readonly type = `${ACTION_SCOPE} Set Error For Failure`;
    constructor(public readonly error: HttpErrorResponse) {}
  }

  export class SetCurrent {
    static readonly type = `${ACTION_SCOPE} Set Current Shelf`;
    constructor(public readonly shelfId: Shelf.Model['id']) {}
  }
}
