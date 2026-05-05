export class FilterDTO {
  tags: number[];
  ingredients: number[];
  author: number;
  cuisine: number;
  rating: number;
  exactRating: boolean;
  creationDate: string;
  prepTime: number;
  exactPrepTime: boolean;
  cookTime: number;
  exactCookTime: boolean;
  totalTime: number;
  exactTotalTime: boolean;

  constructor(
    tags: number[] = [],
    ingredients: number[] = [],
    author: number = 0,
    cuisine: number = 0,
    rating: number = 0,
    exactRating: boolean = false,
    creationDate: string = "",
    prepTime: number = 0,
    exactPrepTime: boolean = false,
    cookTime: number = 0,
    exactCookTime: boolean = false,
    totalTime: number = 0,
    exactTotalTime: boolean = false
  ) {
    this.tags = tags;
    this.ingredients = ingredients;
    this.author = author;
    this.cuisine = cuisine;
    this.rating = rating;
    this.exactRating = exactRating;
    this.creationDate = creationDate;
    this.prepTime = prepTime;
    this.exactPrepTime = exactPrepTime;
    this.cookTime = cookTime;
    this.exactCookTime = exactCookTime;
    this.totalTime = totalTime;
    this.exactTotalTime = exactTotalTime;
  }
}
