import { GetCategoryGroup } from "./GetCategoryGroup";
import { GetUser } from "./GetUser";


export type PostShelf = {
  user: GetUser;
  categoryGroup: GetCategoryGroup;
  name: string;
  position: number;
}
