export class StepData {
  id: number;
  title: string;
  description: string;
  position: number;
  image: string;
  recipeId: number;

  constructor(
    id: number = 0,
    title: string = "",
    description: string = "",
    position: number = 0,
    image: string = "",
    recipeId: number = 0
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.position = position;
    this.image = image;
    this.recipeId = recipeId;
  }
}