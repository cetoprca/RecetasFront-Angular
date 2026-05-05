export class UserDTO {
  id: number = 0;
  username: string = "";
  biography: string = "";
  profilePicturePath: string = "";
  recipes: number[] = [];
  savedRecipes: number[] = [];
  ratings: number[] = [];

  constructor() {}

  get authorProfilePictureURL(): string {
    return this.profilePicturePath || '';
  }

  get authorUsername(): string {
    return this.username || '';
  }
}
