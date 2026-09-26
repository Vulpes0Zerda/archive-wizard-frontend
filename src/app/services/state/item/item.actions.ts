import { HttpErrorResponse } from '@angular/common/http';
import { Item } from '../../model/Item';

export namespace ItemActions {
  const ACTION_SCOPE = '[Item]';
  export class FetchAll {
    static readonly type = `${ACTION_SCOPE} Fetch Item List`;
    constructor(public readonly shelfId: number) {}
  }
  export class CreateItem {
    static readonly type = `${ACTION_SCOPE} Post Create Item`;
    constructor(public readonly createItemRequest: Item.Request.postSingle) {}
  }
  export class DeleteItem {
    static readonly type = `${ACTION_SCOPE} Delete A Item`;
    constructor(public readonly itemId: number) {}
  }
  export class Failure {
    static readonly type = `${ACTION_SCOPE} Set Error For Failure`;
    constructor(public readonly error: HttpErrorResponse) {}
  }
  export class SetCurrent {
    static readonly type = `${ACTION_SCOPE} Set Current Item`;
    constructor(public readonly itemId: number) {}
  }
}
