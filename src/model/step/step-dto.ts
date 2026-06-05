export class StepDTO {
  id?: number;
  title: string;
  description: string;
  position: number;
  image: string;
  recipe: number;

  constructor(
    title: string = "",
    description: string = "",
    position: number = 0,
    image: string = "",
    recipe: number = 0
  ) {
    this.title = title;
    this.description = description;
    this.position = position;
    this.image = image;
    this.recipe = recipe;
  }
}
