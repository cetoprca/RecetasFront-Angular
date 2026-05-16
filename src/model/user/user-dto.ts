export class UserDTO {
  id: string = "";
  displayName: string = "";
  biography: string = "";
  profilePicturePath: string = "";
  recipes: number[] = [];
  savedRecipes: number[] = [];
  ratings: number[] = [];
  following: string[] = [];
  followers: string[] = [];

  constructor() {}

  get authorProfilePictureURL(): string {
    return this.profilePicturePath || '';
  }

  get authorDisplayName(): string {
    return this.displayName || '';
  }
}
