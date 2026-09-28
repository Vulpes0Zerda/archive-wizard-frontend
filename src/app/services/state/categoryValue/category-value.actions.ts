import { HttpErrorResponse } from '@angular/common/http';

export namespace CategoryValueActions {
  const ACTION_SCOPE = '[CategoryValue]';

  export class Failure {
    static readonly type = `${ACTION_SCOPE} Set Failure Error`;
    constructor(public error: HttpErrorResponse) {}
  }

  export class UpdateValues {
    static readonly type = `${ACTION_SCOPE} Update Category Values`;
    constructor(public readonly itemId: number) {}
  }

  export class SetLocalValue {
    static readonly type = `${ACTION_SCOPE} Set Local Category Value`;
    constructor(
      public readonly itemId: number,
      public readonly categoryKeyId: number,
      public readonly value: string,
    ) {}
  }
}
