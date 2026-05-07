import { TagDTO } from "../tag/tag-dto";
import { UserDTO } from "../user/user-dto";

export class RecipeCardDTO {
  id: number = 0;
  tags: TagDTO[] = [];
  imageURL: string = "";
  title: string = "";
  description: string = "";
  cuisine: string = "";
  author: UserDTO | null = null;
  stars: number = 0;
  prepTime: number = 0;
  cookTime: number = 0;
  totalTime: number = 0;
  isSaved: boolean = false;

  constructor() {}

}
