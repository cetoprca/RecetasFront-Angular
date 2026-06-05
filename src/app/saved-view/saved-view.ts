import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { PageResponse } from '../../model/page-response';
import { RecipeScroll } from '../recipe-scroll/recipe-scroll';
import { SavedHeader } from '../saved-header/saved-header';
import { UserService } from '../services/user.service';
import { PaginationDTO } from '../../model/pagination/pagination-dto';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-saved-view',
  standalone: false,
  templateUrl: './saved-view.html',
  styleUrl: './saved-view.css',
})
export class SavedView implements OnInit {
  savedCount: number = 0;
  recipes: RecipeCardDTO[] = [];
  currentPage: number = 0;
  hasMore: boolean = false;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    console.log('SavedView: Initializing with resolved saved recipes');

    const page = this.route.snapshot.data['recipes'] as PageResponse<RecipeCardDTO>;
    this.recipes = page.content;
    this.savedCount = page.totalElements;
    this.hasMore = !page.last;
    this.currentPage = 0;
  }

  onLoadMore(): void {
    if (this.loading || !this.hasMore) return;

    this.loading = true;
    this.currentPage++;

    this.userService.getSavedRecipes(new PaginationDTO(this.currentPage, environment.defaultPageSize)).subscribe({
      next: (page) => {
        this.recipes = [...this.recipes, ...page.content];
        this.hasMore = !page.last;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading more saved recipes:', err);
        this.loading = false;
      }
    });
  }
}
