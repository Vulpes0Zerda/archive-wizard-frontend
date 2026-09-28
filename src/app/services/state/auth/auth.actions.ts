import { HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../../model/Auth';

export namespace AuthActions {
  const ACTION_SCOPE = '[AUTH]';
  export class Login {
    static readonly type = `${ACTION_SCOPE} Post Login`;

    constructor(public loginRequest: Auth.Request.Login) {}
  }

  export class Register {
    static readonly type = `${ACTION_SCOPE} Post Register`;

    constructor(public registrationRequest: Auth.Request.Registration) {}
  }

  export class Refresh {
    static readonly type = `${ACTION_SCOPE} Post Refresh`;

    constructor() {}
  }

  export class Logout {
    static readonly type = `${ACTION_SCOPE} Clear Refresh-Cookie And Auth-Token`;

    constructor() {}
  }

  export class Success {
    static readonly type = `${ACTION_SCOPE} Set Success Auth-Token`;

    constructor(public accessToken: string) {}
  }

  export class Failure {
    static readonly type = `${ACTION_SCOPE} Set Failure Error`;

    constructor(public error: HttpErrorResponse) {}
  }

  export class Await {
    static readonly type = `${ACTION_SCOPE} Set Await Status`;

    constructor() {}
  }
}
