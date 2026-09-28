import { CategoryGroup } from './CategoryGroup';

export namespace CategoryKey {
  export namespace Request {}
  export namespace Response {
    export type GetAll = Array<{
      id: number;
      key: string;
      categoryGroup: CategoryGroup.Model;
      position: number;
    }>;
  }
  export type Model = {
    id: number;
    categoryGroup: CategoryGroup.Model;
    key: string;
    position: number;
  };
}
