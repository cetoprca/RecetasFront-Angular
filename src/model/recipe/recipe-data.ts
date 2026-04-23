import { TagData } from "../tag/tag-data";

export class RecipeData {
  id: number;
  tags: TagData[];
  imageURL: string;
  title: string;
  description: string;
  cuisine: string;
  authorId: number;
  authorUsername: string;
  authorProfilePictureURL: string;
  stars: number;
  prepTime: number;
  cookTime: number;
  totalTime: number;

  constructor(
    id: number = 0,
    tags: TagData[] = [],
    imageURL: string = "",
    title: string = "",
    description: string = "",
    cuisine: string = "",
    authorId: number = 0,
    authorUsername: string = "",
    authorProfilePictureURL: string = "",
    stars: number = 0,
    prepTime: number = 0,
    cookTime: number = 0
  ) {
    this.id = id;
    this.tags = tags;
    this.imageURL = imageURL;
    this.title = title;
    this.description = description;
    this.cuisine = cuisine;
    this.authorId = authorId;
    this.authorUsername = authorUsername;
    this.authorProfilePictureURL = authorProfilePictureURL;
    this.stars = stars;
    this.prepTime = prepTime;
    this.cookTime = cookTime;
    this.totalTime = this.prepTime + this.cookTime;
  }
}