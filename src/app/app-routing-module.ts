import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedView } from './feed-view/feed-view';
import { ProfileView } from './profile-view/profile-view';
import { SavedView } from './saved-view/saved-view';
import { SettingsView } from './settings-view/settings-view';

const routes: Routes = [
  { path: "", component: FeedView },
  { path: "profile", component: ProfileView },
  { path: "saved", component: SavedView },
  { path: "settings", component: SettingsView },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
