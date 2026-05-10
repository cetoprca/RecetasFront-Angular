import { Component, ElementRef, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { TagDTO } from '../../model/tag/tag-dto';
import { ThemeService, Theme } from '../services/theme.service';
import { FilterService } from '../services/filter.service';
import { CuisineService } from '../services/cuisine.service';
import { environment } from '../../environments/environment';
import { RecipeService } from '../services/recipe.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-recipe-card',
  standalone: false,
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.css',
})
export class RecipeCard implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private themeService: ThemeService,
    private filterService: FilterService,
    private cuisineService: CuisineService,
    private userService: UserService
  ) {}

  @Input() recipeData!: RecipeCardDTO;

  currentTheme!: Theme;
  private themeSubscription!: Subscription;
  imageUrl = `${environment.apiUrl}/image/file/`;
  stars: Boolean[] = [];
  showMenu = false;
  private cuisinesByName: Map<string, number> = new Map();

  ngOnInit(){
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => {
        this.currentTheme = theme;
      }
    );
    const stars = this.recipeData.stars || 0;
    for(let i = 0; i<stars; i++){
      this.stars[i] = true;
    }
    for(let i = 0; i<5-stars; i++){
      this.stars[4-i] = false;
    }

    this.cuisineService.getAllCuisines().subscribe({
      next: (cuisines) => {
        for (const c of cuisines) {
          this.cuisinesByName.set(c.name.toLowerCase(), c.id);
        }
      },
      error: (err) => console.error('Error loading cuisines:', err)
    });
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  openRecipe() {
    if (this.recipeData && this.recipeData.id) {
      this.router.navigate(['/recipe', this.recipeData.id]);
    }
  }

  navigateToProfile(event: Event) {
    event.stopPropagation();
    if (this.recipeData.author?.id) {
      this.router.navigate(['/profile', this.recipeData.author.id]);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.showMenu) {
      this.closeMenu();
    }
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }

  saveRecipe(event: Event) {
    event.stopPropagation();
    console.log('Save recipe:', this.recipeData.title, this.recipeData.id);
    this.userService.saveRecipe(this.recipeData.id).subscribe({
       next: () => {
         console.error('Success saving the recipe:');
       },
      error: (err) => {
        console.error('Error saving the recipe:', err);
      }
    });
    this.recipeData.isSaved = !this.recipeData.isSaved;
    this.closeMenu();
  }

  shareRecipe(event: Event) {
    event.stopPropagation();
    console.log('Share recipe:', this.recipeData.title);
    this.closeMenu();
  }

  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;
  private moved = false;
  isTagDragging = false;

  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.isTagDragging = true;
    this.moved = false;
    this.startX = event.pageX;
    this.scrollLeft = (event.currentTarget as HTMLElement).scrollLeft;
  }

  onDrag(event: MouseEvent) {
    if (!this.isDragging) return;

    const container = event.currentTarget as HTMLElement;
    const x = event.pageX;
    const walk = x - this.startX;

    if (Math.abs(walk) > 5) {
      this.moved = true;
    }

    container.scrollLeft = this.scrollLeft - walk;
  }

  endDrag() {
    this.isDragging = false;
    this.isTagDragging = false;
    this.moved = false;
  }

  onTagClick(event: MouseEvent, tag: TagDTO) {
    if (this.moved) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    event.stopPropagation();

    const currentPending = this.filterService.currentFilter;
    const currentTags = currentPending.tags || [];
    if (!currentTags.includes(tag.id)) {
      this.filterService.updateFilter({ tags: [...currentTags, tag.id] });
    }
  }

  onCuisineClick(event: MouseEvent, cuisineName: string) {
    if (this.moved) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    event.stopPropagation();

    const cuisineId = this.cuisinesByName.get(cuisineName.toLowerCase());
    if (cuisineId) {
      this.filterService.updateFilter({ cuisine: cuisineId });
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.parentElement?.remove();
  }
}
