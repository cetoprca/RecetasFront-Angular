import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { UserService } from './user.service';
import { PaginationDTO } from '../../model/pagination/pagination-dto';
import { PageResponse } from '../../model/page-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SavedRecipesResolver implements Resolve<PageResponse<RecipeCardDTO>> {
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PageResponse<RecipeCardDTO>> {
    return this.userService.getSavedRecipes(new PaginationDTO(0, environment.defaultPageSize));
  }
}
