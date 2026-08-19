import { GetCategoryGroup } from "./GetCategoryGroup";
import { GetUser } from "./GetUser";


export type GetShelf = {
  id: number;
  user: GetUser;
  categoryGroup: GetCategoryGroup;
  name: string;
  position: number;
}
