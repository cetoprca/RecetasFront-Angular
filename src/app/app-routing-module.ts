import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginView } from './login-view/login-view';
import { RegisterView } from './register-view/register-view';
import { FullView } from './full-view/full-view';
import { FeedView } from './feed-view/feed-view';
import { ProfileView } from './profile-view/profile-view';
import { ProfileEditView } from './profile-edit-view/profile-edit-view';
import { SavedView } from './saved-view/saved-view';
import { SettingsView } from './settings-view/settings-view';
import { RecipeDetail } from './recipe-detail/recipe-detail';
import { RecipeAddView } from './recipe-add-view/recipe-add-view';
import { AuthGuard } from './services/auth.guard';
import { UserResolver } from './services/user.resolver';
import { FeedRecipesResolver } from './services/feed-recipes.resolver';
import { SavedRecipesResolver } from './services/saved-recipes.resolver';
import { RecipeDetailResolver } from './services/recipe-detail.resolver';
import { RecipeFormResolver } from './services/recipe-form.resolver';

const routes: Routes = [
  { path: 'login', component: LoginView },
  { path: 'register', component: RegisterView },
  {
    path: '',
    component: FullView,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: FeedView, resolve: { recipes: FeedRecipesResolver } },
      { path: 'profile', component: ProfileView, resolve: { user: UserResolver } },
      { path: 'profile/edit', component: ProfileEditView },
      { path: 'profile/:handle', component: ProfileView, resolve: { user: UserResolver } },
      { path: 'saved', component: SavedView, resolve: { recipes: SavedRecipesResolver } },
      { path: 'settings', component: SettingsView },
      { path: 'recipe/new', component: RecipeAddView, resolve: { formData: RecipeFormResolver } },
      { path: 'recipe/:recipeId', component: RecipeDetail, resolve: { recipeData: RecipeDetailResolver } },
    ]
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
