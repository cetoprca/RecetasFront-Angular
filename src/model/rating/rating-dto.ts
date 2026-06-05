export class RatingDTO {
  id: number;
  title: string;
  description: string;
  stars: number;
  author: string;
  recipe: number;

  constructor(
    id: number = 0,
    title: string = "",
    description: string = "",
    stars: number = 0,
    author: string = "",
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
