import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { PageResponse } from '../../model/page-response';
import { RecipeScroll } from '../recipe-scroll/recipe-scroll';
import { ProfileHeader } from '../profile-header/profile-header';
import { RecipeService } from '../services/recipe.service';
import { FilterService } from '../services/filter.service';
import { AuthService } from '../services/auth.service';
import { UserDTO } from '../../model/user/user-dto';
import { UserWithRecipes } from '../services/user.resolver';
import { PaginationDTO } from '../../model/pagination/pagination-dto';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile-view',
  standalone: false,
  templateUrl: './profile-view.html',
  styleUrl: './profile-view.css',
})
export class ProfileView implements OnInit, OnDestroy {
  displayName: string = "";
  handle: string = "";
  bio: string = "";
  profilePicture: string = "";
  followers: number = 0;
  following: number = 0;
  recipesCount: number = 0;
  isFollowing: boolean = false;

  recipes: RecipeCardDTO[] = [];
  currentPage: number = 0;
  hasMore: boolean = false;
  loading: boolean = false;

  private authSubscription!: Subscription;

  constructor(
    private recipeService: RecipeService,
    private filterService: FilterService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('ProfileView: Initializing with resolved user and recipes');

    const resolvedData = this.route.snapshot.data['user'] as UserWithRecipes;
    this.setUserData(resolvedData.user);
    this.recipes = resolvedData.recipes.content;
    this.hasMore = !resolvedData.recipes.last;
    this.currentPage = 0;
    this.recipesCount = resolvedData.recipes.totalElements;

    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isFollowing = user.following?.includes(this.handle) ?? false;
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) { this.authSubscription.unsubscribe(); }
  }

  get isOwnProfile(): boolean {
    return !this.route.snapshot.paramMap.get('handle');
  }

  navigateToOwnProfile() {
    this.router.navigate(['/profile']);
  }

  onLoadMore(): void {
    if (this.loading || !this.hasMore) return;

    this.loading = true;
    this.currentPage++;

    this.recipeService.getRecipesByUser(this.handle, new PaginationDTO(this.currentPage, environment.defaultPageSize)).subscribe({
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

  private setUserData(user: UserDTO) {
    this.handle = user.id;
    this.displayName = user.displayName;
    this.bio = user.biography || "";
    this.profilePicture = user.profilePicturePath || "";
    this.followers = user.followers?.length || 0;
    this.following = user.following?.length || 0;

    this.filterService.setAuthor(this.handle);
  }

}
