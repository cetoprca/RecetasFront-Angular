import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { RecipeScroll } from '../recipe-scroll/recipe-scroll';
import { RecipeService } from '../services/recipe.service';
import { FilterService } from '../services/filter.service';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';

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
    private filterService: FilterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('FeedView: Initializing with resolved recipes');
    
    // Get recipes from resolver (loaded with all filters null)
    this.recipes = this.route.snapshot.data['recipes'];
    
    // Initialize filter to null state
    this.initializeFilter();
    
    // Subscribe to future filter changes (skip the initial value to avoid redundant HTTP call)
    this.filterSubscription = this.filterService.currentFilter$
      .pipe(skip(1))
      .subscribe(() => {
        this.loadRecipes();
      });

      console.log(this.recipes);
  }

  ngOnDestroy() {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  private initializeFilter(): void {
    this.filterService.resetFilter();
  }

  private loadRecipes(): void {
    const filter = this.filterService.currentFilter;
    this.recipeService.getFilteredRecipes(filter).subscribe({
      next: (recipes) => this.recipes = recipes,
      error: (err) => console.error('Error loading recipes:', err)
    });
  }
}
