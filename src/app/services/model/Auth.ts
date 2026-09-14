export namespace Auth {
  export namespace Request {
    export type Login = {
      email: string;
      password: string;
    };
    export type Registration = {
      name: string;
      email: string;
      password: string;
    };
  }
  export namespace Response {
    export type Login = AccessToken;
    export type Registration = AccessToken;
    export type Refresh = AccessToken;
  }
}

type AccessToken = { accessToken: string };
