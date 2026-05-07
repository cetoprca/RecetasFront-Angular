import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SavedRecipesResolver implements Resolve<RecipeCardDTO[]> {
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RecipeCardDTO[]> {
    return this.userService.getSavedRecipes();
  }
}
