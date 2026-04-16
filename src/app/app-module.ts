import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import {MaterialModule } from './material-modules';
import { LeftSideMenu } from './left-side-menu/left-side-menu';
import { RightSideMenu } from './right-side-menu/right-side-menu';
import { RecipeCard } from './recipe-card/recipe-card';
import { RecipeScroll } from './recipe-scroll/recipe-scroll';
import { ProfileView } from './profile-view/profile-view';
import { SavedView } from './saved-view/saved-view';
import { FeedView } from './feed-view/feed-view';
import { ProfileHeader } from './profile-header/profile-header';
import { SavedHeader } from './saved-header/saved-header';
import { SettingsView } from './settings-view/settings-view';
import { FullView } from './full-view/full-view';
import { LoginView } from './login-view/login-view'

@NgModule({
  declarations: [
    App,
    LeftSideMenu,
    RightSideMenu,
    RecipeCard,
    RecipeScroll,
    ProfileView,
    SavedView,
    FeedView,
    ProfileHeader,
    SavedHeader,
    SettingsView,
    FullView,
    LoginView
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
  ],
  bootstrap: [App]
})
export class AppModule { }
