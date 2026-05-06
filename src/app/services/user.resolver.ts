import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { UserDTO } from '../../model/user/user-dto';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { UserService } from './user.service';
import { RecipeService } from './recipe.service';
import { FilterDTO } from '../../model/filter/filter-dto';

export interface UserWithRecipes {
  user: UserDTO;
  recipes: RecipeCardDTO[];
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
    const userId = route.paramMap.get('userId');
    const userObs = userId ? this.userService.getUserById(+userId) : this.userService.getCurrentUser();
    
    return userObs.pipe(
      switchMap(user => {
        // Create a filter with the author set to this user's ID
        const authorFilter = new FilterDTO(null, null, user.id, null, null, null, null, null, null, null, null, null, null);
        return this.recipeService.getFilteredRecipes(authorFilter).pipe(
          map(recipes => ({ user, recipes }))
        );
      })
    );
  }
}
