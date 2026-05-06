import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { RecipeScroll } from '../recipe-scroll/recipe-scroll';
import { ProfileHeader } from '../profile-header/profile-header';
import { RecipeService } from '../services/recipe.service';
import { FilterService } from '../services/filter.service';
import { UserDTO } from '../../model/user/user-dto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-view',
  standalone: false,
  templateUrl: './profile-view.html',
  styleUrl: './profile-view.css',
})
export class ProfileView implements OnInit, OnDestroy {
  username: string = "Chef María";
  userHandle: string = "chefmaria";
  bio: string = "Amante de la cocina mediterránea. Compartiendo mis recetas favoritas 🍳";
  profilePicture: string = "https://randomuser.me/api/portraits/women/44.jpg";
  followers: number = 0;
  following: number = 0;
  recipesCount: number = 0;
  userId: number = 0;

  recipes: RecipeCardDTO[] = [];
  private filterSubscription!: Subscription;

  constructor(
    private recipeService: RecipeService,
    private filterService: FilterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('ProfileView: Initializing with resolved user data');
    
    // Get user data from route resolver (synchronously available)
    const user = this.route.snapshot.data['user'] as UserDTO;
    this.setUserData(user);

    this.filterSubscription = this.filterService.currentFilter$.subscribe(() => {
      this.loadRecipes();
    });
  }

  get isOwnProfile(): boolean {
    return !this.route.snapshot.paramMap.get('userId');
  }

  navigateToOwnProfile() {
    this.router.navigate(['/profile']);
  }

  ngOnDestroy() {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  private setUserData(user: UserDTO) {
    console.log('ProfileView: Loading user data', user);
    this.userId = user.id;
    this.username = user.username;
    this.userHandle = user.username;
    this.bio = user.biography || "";
    this.profilePicture = user.profilePicturePath || "";
    this.followers = 0;
    this.following = 0;
    this.recipesCount = user.recipes?.length || 0;

    this.filterService.setAuthor(this.userId);
    this.loadRecipes();
  }

  private loadRecipes() {
    const filter = this.filterService.currentFilter;
    this.recipeService.getFilteredRecipes(filter).subscribe({
      next: (recipes) => this.recipes = recipes,
      error: (err) => console.error('Error loading recipes:', err)
    });
  }
}
