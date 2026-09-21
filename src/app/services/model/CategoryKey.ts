import { CategoryGroup } from './CategoryGroup';

export namespace CategoryKey {
  export namespace Request {}
  export namespace Response {}
  export type Model = {
    id: number;
    categoryGroup: CategoryGroup.Model;
    key: string;
    position: number;
  };
}
