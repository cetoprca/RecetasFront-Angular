import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { StepDTO } from '../../model/step/step-dto';
import { ThemeService, Theme } from '../services/theme.service';
import { ActivatedRoute } from '@angular/router';
import { RecipeInfo } from '../recipe-info/recipe-info';
import { RecipeDetailData } from '../services/recipe-detail.resolver';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-recipe-detail',
  standalone: false,
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css',
})
export class RecipeDetail implements OnInit, OnDestroy {
  currentTheme!: Theme;
  private themeSubscription!: Subscription;
  imageUrl = `${environment.apiUrl}/image/file/`;
  recipeId!: number;
  recipe: RecipeCardDTO | null = null;
  steps: StepDTO[] = [];

  constructor(
    private themeService: ThemeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => {
        this.currentTheme = theme;
      }
    );

    const data = this.route.snapshot.data['recipeData'] as RecipeDetailData;
    this.recipe = data.recipe;
    this.steps = data.steps;
    this.recipeId = data.recipe.id;
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}