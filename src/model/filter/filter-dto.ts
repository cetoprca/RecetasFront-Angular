export class FilterDTO {
  tags: number[] | null;
  ingredients: number[] | null;
  author: number | null;
  cuisine: number | null;
  rating: number | null;
  exactRating: boolean | null;
  creationDate: string | null;
  prepTime: number | null;
  exactPrepTime: boolean | null;
  cookTime: number | null;
  exactCookTime: boolean | null;
  totalTime: number | null;
  exactTotalTime: boolean | null;

  constructor(
    tags: number[] | null = null,
    ingredients: number[] | null = null,
    author: number | null = null,
    cuisine: number | null = null,
    rating: number | null = null,
    exactRating: boolean | null = null,
    creationDate: string | null = null,
    prepTime: number | null = null,
    exactPrepTime: boolean | null = null,
    cookTime: number | null = null,
    exactCookTime: boolean | null = null,
    totalTime: number | null = null,
    exactTotalTime: boolean | null = null
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
