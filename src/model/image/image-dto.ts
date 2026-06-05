export class ImageDTO {
  url: string;
  usedInUsers: number[];
  usedInRecipes: number[];
  usedInSteps: number[];

  constructor(
    url: string = "",
    usedInUsers: number[] = [],
    usedInRecipes: number[] = [],
    usedInSteps: number[] = []
  ) {
    this.url = url;
    this.usedInUsers = usedInUsers;
    this.usedInRecipes = usedInRecipes;
    this.usedInSteps = usedInSteps;
  }
}
