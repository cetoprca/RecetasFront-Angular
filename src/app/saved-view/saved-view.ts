import { Component, OnInit } from '@angular/core';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { RecipeScroll } from '../recipe-scroll/recipe-scroll';
import { SavedHeader } from '../saved-header/saved-header';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-saved-view',
  standalone: false,
  templateUrl: './saved-view.html',
  styleUrl: './saved-view.css',
})
export class SavedView implements OnInit {
  savedCount: number = 0;
  recipes: RecipeCardDTO[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.loadSavedRecipes();
  }

  private loadSavedRecipes() {
    this.recipeService.getSavedRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.savedCount = recipes.length;
      },
      error: (err) => console.error('Error loading saved recipes:', err)
    });
  }
}
