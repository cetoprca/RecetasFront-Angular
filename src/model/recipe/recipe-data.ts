import { TagData } from "../tag/tag-data";

export class RecipeData {
  tags: TagData[];
  imageURL: string;
  title: string;
  description: string;
  cuisine: string;
  authorProfilePictureURL: string;
  stars: number;
  prepTime: number;
  cookTime: number;
  totalTime: number;

  constructor(
    tags: TagData[] = [],
    imageURL: string = "",
    title: string = "",
    description: string = "",
    cuisine: string = "",
    authorProfilePictureURL: string = "",
    stars: number = 0,
    prepTime: number = 0,
    cookTime: number = 0
  ) {
    this.tags = tags;
    this.imageURL = imageURL;
    this.title = title;
    this.description = description;
    this.cuisine = cuisine;
    this.authorProfilePictureURL = authorProfilePictureURL;
    this.stars = stars;
    this.prepTime = prepTime;
    this.cookTime = cookTime;
    this.totalTime = this.prepTime + this.cookTime;
  }
}