import { User } from './User';
import { CategoryGroup } from './CategoryGroup';

export type Shelf = {
  id: number;
  user: User;
  categoryGroup: CategoryGroup;
  name: string;
  position: number;
};
