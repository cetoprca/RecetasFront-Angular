import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { StepDTO } from '../../model/step/step-dto';
import { ThemeService, Theme } from '../services/theme.service';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { StepService } from '../services/step.service';
import { RecipeInfo } from '../recipe-info/recipe-info';

@Component({
  selector: 'app-recipe-detail',
  standalone: false,
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css',
})
export class RecipeDetail implements OnInit, OnDestroy {
  currentTheme!: Theme;
  private themeSubscription!: Subscription;
  recipeId!: number;
  recipe: RecipeCardDTO | null = null;
  steps: StepDTO[] = [];

  constructor(
    private themeService: ThemeService,
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private stepService: StepService
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => {
        this.currentTheme = theme;
      }
    );

    this.route.params.subscribe(params => {
      this.recipeId = params['recipeId'];
      this.loadRecipe();
    });
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  private loadRecipe() {
    this.recipeService.getRecipeById(this.recipeId).subscribe({
      next: (recipe) => this.recipe = recipe,
      error: (err) => console.error('Error loading recipe:', err)
    });

    this.stepService.getStepsByRecipeId(this.recipeId).subscribe({
      next: (steps) => this.steps = steps,
      error: (err) => console.error('Error loading steps:', err)
    });
  }
}