import { CategoryValue } from './CategoryValue';
import { Shelf } from './Shelf';

export namespace Item {
  export namespace Response {
    export type GetItems = Array<{
      id: number;
      name: string;
      picture: string;
      shelf: Shelf.Model;
      categoryValues: Array<CategoryValue.Model>;
    }>;
    export type PostSingle = {
      id: number;
      name: string;
      picture: string;
      shelf: Shelf.Model;
      categoryValues: Array<CategoryValue.Model>;
    };
  }
  export namespace Request {
    export type postSingle = {
      name: string;
      shelfId: number;
    };
  }

  export type Model = {
    id: number;
    name: string;
    picture: string;
    shelfId: number;
    categoryValues: Array<CategoryValue.State>;
  };
}
