import { CategoryKey } from './CategoryKey';

export namespace CategoryGroup {
  export namespace Request {
    export type PostSingle = {
      name: string;
    };
    export type DeleteSingle = {
      id: number;
    };
  }
  export namespace Response {
    export type GetAll = Array<{
      id: number;
      name: string;
    }>;

    export type PostSingle = {
      id: number;
      name: string;
    };
  }
  export type Model = {
    id: number;
    name: string;
  };
}
