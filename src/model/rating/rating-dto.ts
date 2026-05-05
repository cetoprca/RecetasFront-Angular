export class RatingDTO {
  id: number;
  title: string;
  description: string;
  stars: number;
  author: number;
  recipe: number;

  constructor(
    id: number = 0,
    title: string = "",
    description: string = "",
    stars: number = 0,
    author: number = 0,
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
