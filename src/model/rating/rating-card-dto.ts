import { UserDTO } from "../user/user-dto";

export class RatingCardDTO {
  id: number;
  title: string;
  description: string;
  stars: number;
  author: UserDTO | null;
  recipe: number;

  constructor(
    id: number = 0,
    title: string = "",
    description: string = "",
    stars: number = 0,
    author: UserDTO | null = null,
    recipe: number = 0
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.stars = stars;
    this.author = author;
    this.recipe = recipe;
  }
}
