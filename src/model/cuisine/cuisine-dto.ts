export class CuisineDTO {
  id: number;
  name: string;
  recipes: number[];

  constructor(id: number = 0, name: string = "", recipes: number[] = []) {
    this.id = id;
    this.name = name;
    this.recipes = recipes;
  }
}
