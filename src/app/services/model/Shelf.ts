import { CategoryGroup } from './CategoryGroup';

export namespace Shelf {
  export namespace Response {
    export type GetAll = Array<{
      id: number;
      categoryGroup: CategoryGroup.Model;
      name: string;
      position: number;
    }>;
    export type PostSingle = Array<{
      id: number;
      categoryGroup: CategoryGroup.Model;
      name: string;
      position: number;
    }>;
  }
  export namespace Request {
    export type PostSingle = {
      categoryGroupId: number;
      name: string;
      position: number;
    };
  }
  export type Model = {
    id: number;
    categoryGroup: CategoryGroup.Model;
    name: string;
    position: number;
  };
}
