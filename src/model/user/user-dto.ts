export class UserDTO {
  id: string = "";
  displayName: string = "";
  biography: string = "";
  profilePicturePath: string = "";
  recipes: number[] = [];
  savedRecipes: number[] = [];
  ratings: number[] = [];

  constructor() {}

  get authorProfilePictureURL(): string {
    return this.profilePicturePath || '';
  }

  get authorDisplayName(): string {
    return this.displayName || '';
  }
}
