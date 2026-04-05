import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeScroll } from './recipe-scroll/recipe-scroll';
import { RecipeView } from './recipe-view/recipe-view';
import { ProfileView } from './profile-view/profile-view';
import { SavedView } from './saved-view/saved-view';

const routes: Routes = [
  { path: "profile", component: ProfileView },
  { path: "recipe", component: RecipeView },
  { path: "saved", component: SavedView },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
