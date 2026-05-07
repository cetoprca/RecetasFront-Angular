import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { RecipeService } from './recipe.service';
import { FilterDTO } from '../../model/filter/filter-dto';
import { PaginationDTO } from '../../model/pagination/pagination-dto';
import { RecipeFilterRequest } from '../../model/recipe/recipe-filter-request';
import { PageResponse } from '../../model/page-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedRecipesResolver implements Resolve<PageResponse<RecipeCardDTO>> {
  constructor(private recipeService: RecipeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PageResponse<RecipeCardDTO>> {
    const nullFilter = new FilterDTO(null, null, null, null, null, null, null, null, null, null, null, null, null);
    const request = new RecipeFilterRequest(nullFilter, new PaginationDTO(0, environment.defaultPageSize));
    return this.recipeService.getFilteredRecipes(request);
  }
}
