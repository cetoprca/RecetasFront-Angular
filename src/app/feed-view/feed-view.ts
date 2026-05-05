import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { RecipeScroll } from '../recipe-scroll/recipe-scroll';
import { RecipeService } from '../services/recipe.service';
import { FilterService } from '../services/filter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feed-view',
  standalone: false,
  templateUrl: './feed-view.html',
  styleUrl: './feed-view.css',
})
export class FeedView implements OnInit, OnDestroy {
  recipes: RecipeCardDTO[] = [];
  private filterSubscription!: Subscription;

  constructor(
    private recipeService: RecipeService,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    this.loadRecipes();
    this.filterSubscription = this.filterService.currentFilter$.subscribe(() => {
      this.loadRecipes();
    });
  }

  ngOnDestroy() {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  private loadRecipes() {
    const filter = this.filterService.currentFilter;
    this.recipeService.getFilteredRecipes(filter).subscribe({
      next: (recipes) => this.recipes = recipes,
      error: (err) => console.error('Error loading recipes:', err)
    });
  }
}
