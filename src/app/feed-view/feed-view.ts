import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { PageResponse } from '../../model/page-response';
import { RecipeScroll } from '../recipe-scroll/recipe-scroll';
import { RecipeService } from '../services/recipe.service';
import { FilterService } from '../services/filter.service';
import { RecipeFilterRequest } from '../../model/recipe/recipe-filter-request';
import { PaginationDTO } from '../../model/pagination/pagination-dto';
import { environment } from '../../environments/environment';
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
  currentPage: number = 0;
  hasMore: boolean = false;
  loading: boolean = false;
  private filterSubscription!: Subscription;

  constructor(
    private recipeService: RecipeService,
    private filterService: FilterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('FeedView: Initializing with resolved recipes');

    const page = this.route.snapshot.data['recipes'] as PageResponse<RecipeCardDTO>;
    this.recipes = page.content;
    this.hasMore = !page.last;
    this.currentPage = 0;

    this.initializeFilter();

    this.filterSubscription = this.filterService.currentFilter$
      .pipe(skip(1))
      .subscribe(() => {
        this.onFilterChanged();
      });
  }

  ngOnDestroy() {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  onLoadMore(): void {
    if (this.loading || !this.hasMore) return;

    this.loading = true;
    this.currentPage++;
    const filter = this.filterService.currentFilter;
    const request = new RecipeFilterRequest(filter, new PaginationDTO(this.currentPage, environment.defaultPageSize));

    this.recipeService.getFilteredRecipes(request).subscribe({
      next: (page) => {
        this.recipes = [...this.recipes, ...page.content];
        this.hasMore = !page.last;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading more recipes:', err);
        this.loading = false;
      }
    });
  }

  private initializeFilter(): void {
    this.filterService.resetFilter();
  }

  private onFilterChanged(): void {
    this.currentPage = 0;
    this.loading = true;
    const filter = this.filterService.currentFilter;
    const request = new RecipeFilterRequest(filter, new PaginationDTO(0, environment.defaultPageSize));

    this.recipeService.getFilteredRecipes(request).subscribe({
      next: (page) => {
        this.recipes = page.content;
        this.hasMore = !page.last;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading recipes:', err);
        this.loading = false;
      }
    });
  }
}
