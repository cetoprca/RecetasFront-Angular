import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import {MaterialModule } from './material-modules';
import { LeftSideMenu } from './left-side-menu/left-side-menu';
import { RightSideMenu } from './right-side-menu/right-side-menu';
import { RecipeCard } from './recipe-card/recipe-card';
import { RecipeDetail } from './recipe-detail/recipe-detail';
import { RecipeInfo } from './recipe-info/recipe-info';
import { RecipeScroll } from './recipe-scroll/recipe-scroll';
import { ProfileView } from './profile-view/profile-view';
import { SavedView } from './saved-view/saved-view';
import { FeedView } from './feed-view/feed-view';
import { ProfileHeader } from './profile-header/profile-header';
import { SavedHeader } from './saved-header/saved-header';
import { SettingsView } from './settings-view/settings-view';
import { FullView } from './full-view/full-view';
import { LoginView } from './login-view/login-view';
import { RegisterView } from './register-view/register-view';
import { AuthInterceptor } from './services/auth.interceptor';
import { RatingView } from './rating-view/rating-view';
import { RatingCard } from './rating-card/rating-card';
import { ProfileEditView } from './profile-edit-view/profile-edit-view';
import { RatingModal } from './rating-modal/rating-modal';
import { RecipeAddView } from './recipe-add-view/recipe-add-view';

@NgModule({
  declarations: [
    App,
    LeftSideMenu,
    RightSideMenu,
    RecipeCard,
    RecipeDetail,
    RecipeInfo,
    RecipeScroll,
    ProfileView,
    SavedView,
    FeedView,
    ProfileHeader,
    SavedHeader,
    SettingsView,
    FullView,
    LoginView,
    RegisterView,
    RatingView,
    RatingCard,
    ProfileEditView,
    RatingModal,
    RecipeAddView
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json' }),
    provideBrowserGlobalErrorListeners(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [App]
})
export class AppModule { }
