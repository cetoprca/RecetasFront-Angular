import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { UserDTO } from '../../model/user/user-dto';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { UserService } from './user.service';
import { RecipeService } from './recipe.service';
import { PaginationDTO } from '../../model/pagination/pagination-dto';
import { PageResponse } from '../../model/page-response';
import { environment } from '../../environments/environment';

export interface UserWithRecipes {
  user: UserDTO;
  recipes: PageResponse<RecipeCardDTO>;
}

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<UserWithRecipes> {
  constructor(
    private userService: UserService,
    private recipeService: RecipeService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserWithRecipes> {
    const userId = route.paramMap.get('handle');
    const userObs = userId ? this.userService.getUserById(userId) : this.userService.getCurrentUser();
    
    return userObs.pipe(
      switchMap(user => {
        return this.recipeService.getRecipesByUser(user.id, new PaginationDTO(0, environment.defaultPageSize)).pipe(
          map(recipes => ({ user, recipes }))
        );
      })
    );
  }
}
