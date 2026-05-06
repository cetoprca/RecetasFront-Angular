import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { RecipeService } from './recipe.service';
import { FilterDTO } from '../../model/filter/filter-dto';

@Injectable({
  providedIn: 'root'
})
export class FeedRecipesResolver implements Resolve<RecipeCardDTO[]> {
  constructor(private recipeService: RecipeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RecipeCardDTO[]> {
    // Create a filter with all fields set to null (no filters applied)
    const nullFilter = new FilterDTO(null, null, null, null, null, null, null, null, null, null, null, null, null);
    return this.recipeService.getFilteredRecipes(nullFilter);
  }
}
