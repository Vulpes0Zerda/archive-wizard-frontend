import { CategoryKey } from './CategoryKey';
import { Item } from './Item';

export namespace CategoryValue {
  export namespace Request {
    export type UpdateAll = Array<{
      value: string;
      itemId: number;
      categoryKeyId: number;
    }>;
  }
  export namespace Response {
    export type UpdateAll = Array<{
      id: number;
      value: string;
      item: Item.Model;
      categoryKey: CategoryKey.Model;
    }>;
  }

  export type Model = {
    id: number;
    value: string;
    item: Item.Model;
    categoryKey: CategoryKey.Model;
  };

  export type State = {
    id: number | null;
    value: string;
    itemId: number;
    categoryKeyId: number;
  };
}
