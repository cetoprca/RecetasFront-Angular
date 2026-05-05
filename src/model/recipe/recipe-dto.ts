export class RecipeDTO {
  id: number = 0;
  title: string = "";
  description: string = "";
  image: string = "";
  prepTime: number = 0;
  cookTime: number = 0;
  totalTime: number = 0;
  isPublic: boolean = false;
  creationDate: string = "";
  author: number = 0;
  cuisine: number = 0;
  ratings: number[] = [];
  steps: number[] = [];
  tags: number[] = [];
  ingredients: number[] = [];

  constructor() {}

}
