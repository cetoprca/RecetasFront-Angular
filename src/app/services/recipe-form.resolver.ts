import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { CuisineDTO } from '../../model/cuisine/cuisine-dto';
import { TagDTO } from '../../model/tag/tag-dto';
import { IngredientDTO } from '../../model/ingredient/ingredient-dto';
import { CuisineService } from './cuisine.service';
import { TagService } from './tag.service';
import { IngredientService } from './ingredient.service';

export interface RecipeFormData {
  cuisines: CuisineDTO[];
  tags: TagDTO[];
  ingredients: IngredientDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class RecipeFormResolver implements Resolve<RecipeFormData> {
  constructor(
    private cuisineService: CuisineService,
    private tagService: TagService,
    private ingredientService: IngredientService
  ) {}

  resolve(): Observable<RecipeFormData> {
    return forkJoin({
      cuisines: this.cuisineService.getAllCuisines(),
      tags: this.tagService.getAllTags(),
      ingredients: this.ingredientService.getAllIngredients()
    });
  }
}
