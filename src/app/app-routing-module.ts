import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginView } from './login-view/login-view';
import { FullView } from './full-view/full-view';
import { FeedView } from './feed-view/feed-view';
import { ProfileView } from './profile-view/profile-view';
import { SavedView } from './saved-view/saved-view';
import { SettingsView } from './settings-view/settings-view';
import { RecipeDetail } from './recipe-detail/recipe-detail';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginView },
  {
    path: '',
    component: FullView,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: FeedView },
      { path: 'profile', component: ProfileView },
      { path: 'profile/:userId', component: ProfileView },
      { path: 'saved', component: SavedView },
      { path: 'settings', component: SettingsView },
      { path: 'recipe/:recipeId', component: RecipeDetail },
    ]
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
