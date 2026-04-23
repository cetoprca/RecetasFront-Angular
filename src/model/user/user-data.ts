export class UserData {
  id: number;
  username: string;
  biography: string;
  profilePicturePath: string;
  recipes: number[];
  savedRecipes: number[];
  ratings: number[];

  constructor(
    id: number = 0,
    username: string = "",
    biography: string = "",
    profilePicturePath: string = "",
    recipes: number[] = [],
    savedRecipes: number[] = [],
    ratings: number[] = []
  ) {
    this.id = id;
    this.username = username;
    this.biography = biography;
    this.profilePicturePath = profilePicturePath;
    this.recipes = recipes;
    this.savedRecipes = savedRecipes;
    this.ratings = ratings;
  }
}
