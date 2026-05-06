import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { StepDTO } from '../../model/step/step-dto';
import { RecipeService } from './recipe.service';
import { StepService } from './step.service';

export interface RecipeDetailData {
  recipe: RecipeCardDTO;
  steps: StepDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class RecipeDetailResolver implements Resolve<RecipeDetailData> {
  constructor(
    private recipeService: RecipeService,
    private stepService: StepService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RecipeDetailData> {
    const recipeId = +route.paramMap.get('recipeId')!;
    
    return forkJoin({
      recipe: this.recipeService.getRecipeById(recipeId),
      steps: this.stepService.getStepsByRecipeId(recipeId)
    });
  }
}
