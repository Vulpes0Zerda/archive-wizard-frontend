import { CategoryGroup } from './CategoryGroup';

export namespace Shelf {
  export namespace Response {
    export type GetAll = [
      {
        id: number;
        categoryGroupId: number;
        name: string;
        position: number;
      },
    ];
    export type PostSingle = [
      {
        id: number;
        categoryGroupId: number;
        name: string;
        position: number;
      },
    ];
  }
  export namespace Request {
    export type PostSingle = {
      categoryGroup: CategoryGroup.Model;
      name: string;
      position: number;
    };
  }
}
