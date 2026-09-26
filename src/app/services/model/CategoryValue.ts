import { CategoryKey } from './CategoryKey';
import { Item } from './Item';

export namespace CategoryValue {
  export namespace Request {}
  export namespace Response {}

  export type Model = {
    id: number;
    value: string;
    item: Item.Model;
    categoryKey: CategoryKey.Model;
  };

  export type State = {
    id: number;
    value: string;
    itemId: number;
    categoryKeyId: number;
  };
}
