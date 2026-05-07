import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { ThemeService, Theme } from '../services/theme.service';
import { FilterService } from '../services/filter.service';
import { FilterDTO } from '../../model/filter/filter-dto';
import { TagService } from '../services/tag.service';
import { IngredientService } from '../services/ingredient.service';
import { CuisineService } from '../services/cuisine.service';

interface FilterOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-right-side-menu',
  standalone: false,
  templateUrl: './right-side-menu.html',
  styleUrl: './right-side-menu.css',
})
export class RightSideMenu implements OnInit, OnDestroy {
  currentTheme!: Theme;
  private themeSubscription!: Subscription;
  private filterSubscription!: Subscription;
  private updatingFromService = false;

  constructor(
    private themeService: ThemeService,
    private filterService: FilterService,
    private router: Router,
    private tagService: TagService,
    private ingredientService: IngredientService,
    private cuisineService: CuisineService
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => {
        this.currentTheme = theme;
      }
    );

    this.tagService.getAllTags().subscribe({
      next: (tags) => this.availableTags = tags.map(t => ({ id: t.id, name: t.name })),
      error: (err) => console.error('Error loading tags:', err)
    });

    this.ingredientService.getAllIngredients().subscribe({
      next: (ingredients) => this.availableIngredients = ingredients.map(i => ({ id: i.id, name: i.name })),
      error: (err) => console.error('Error loading ingredients:', err)
    });

    this.cuisineService.getAllCuisines().subscribe({
      next: (cuisines) => this.availableCuisines = cuisines.map(c => ({ id: c.id, name: c.name })),
      error: (err) => console.error('Error loading cuisines:', err)
    });

    this.filterSubscription = this.filterService.currentFilter$.subscribe(filter => {
      if (!this.updatingFromService) {
        this.syncFromService(filter);
      }
    });
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  selectedTags: FilterOption[] = [];
  availableTags: FilterOption[] = [];

  selectedIngredients: FilterOption[] = [];
  availableIngredients: FilterOption[] = [];

  selectedCuisineId: number | null = null;
  availableCuisines: FilterOption[] = [];

  tagSearchText: string = '';
  ingredientSearchText: string = '';
  cuisineSearchText: string = '';

  get filteredAvailableTags(): FilterOption[] {
    return this.availableTags.filter(t =>
      t.name.toLowerCase().includes(this.tagSearchText.toLowerCase())
    );
  }

  get filteredAvailableIngredients(): FilterOption[] {
    return this.availableIngredients.filter(i =>
      i.name.toLowerCase().includes(this.ingredientSearchText.toLowerCase())
    );
  }

  get filteredAvailableCuisines(): FilterOption[] {
    return this.availableCuisines.filter(c =>
      c.name.toLowerCase().includes(this.cuisineSearchText.toLowerCase())
    );
  }

  rating: number = 0;
  exactRating: boolean = false;
  
  prepTime: number = 0;
  exactPrepTime: boolean = false;
  
  cookTime: number = 0;
  exactCookTime: boolean = false;
  
  totalTime: number = 0;
  exactTotalTime: boolean = false;
  
  creationDate: string = '';

  expandedSections: { [key: string]: boolean } = {
    rating: true,
    tiempo: true,
    prepTime: true,
    cookTime: true,
    totalTime: true,
    creationDate: true
  };

  showTagDropdown: boolean = false;
  showIngredientDropdown: boolean = false;
  showCuisineDropdown: boolean = false;

  toggleSection(section: string): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  toggleTagDropdown(): void {
    this.showTagDropdown = !this.showTagDropdown;
    this.tagSearchText = '';
    this.showIngredientDropdown = false;
    this.showCuisineDropdown = false;
  }

  toggleIngredientDropdown(): void {
    this.showIngredientDropdown = !this.showIngredientDropdown;
    this.ingredientSearchText = '';
    this.showTagDropdown = false;
    this.showCuisineDropdown = false;
  }

  toggleCuisineDropdown(): void {
    this.showCuisineDropdown = !this.showCuisineDropdown;
    this.cuisineSearchText = '';
    this.showTagDropdown = false;
    this.showIngredientDropdown = false;
  }

  addTagById(tagId: number): void {
    const tag = this.availableTags.find(t => t.id === tagId);
    if (tag && !this.isTagSelected(tagId)) {
      this.selectedTags.push(tag);
    }
    this.showTagDropdown = false;
  }

  addIngredientById(ingredientId: number): void {
    const ingredient = this.availableIngredients.find(i => i.id === ingredientId);
    if (ingredient && !this.isIngredientSelected(ingredientId)) {
      this.selectedIngredients.push(ingredient);
    }
    this.showIngredientDropdown = false;
  }

  isTagSelected(tagId: number): boolean {
    return this.selectedTags.some(t => t.id === tagId);
  }

  isIngredientSelected(ingredientId: number): boolean {
    return this.selectedIngredients.some(i => i.id === ingredientId);
  }

  selectCuisine(cuisineId: number): void {
    this.selectedCuisineId = cuisineId;
    this.showCuisineDropdown = false;
  }

  removeCuisine(): void {
    this.selectedCuisineId = null;
  }

  getCuisineName(cuisineId: number): string {
    return this.availableCuisines.find(c => c.id === cuisineId)?.name || '';
  }

  addTag(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const tagId = parseInt(select.value);
    if (tagId && !this.isTagSelected(tagId)) {
      const tag = this.availableTags.find(t => t.id === tagId);
      if (tag) {
        this.selectedTags.push(tag);
      }
    }
    select.value = '';
  }

  removeTag(tag: FilterOption): void {
    this.selectedTags = this.selectedTags.filter(t => t.id !== tag.id);
  }

  addIngredient(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const ingredientId = parseInt(select.value);
    if (ingredientId && !this.isIngredientSelected(ingredientId)) {
      const ingredient = this.availableIngredients.find(i => i.id === ingredientId);
      if (ingredient) {
        this.selectedIngredients.push(ingredient);
      }
    }
    select.value = '';
  }

  removeIngredient(ingredient: FilterOption): void {
    this.selectedIngredients = this.selectedIngredients.filter(i => i.id !== ingredient.id);
  }

  setRating(star: number): void {
    this.rating = this.rating === star ? 0 : star;
  }

  applyFilters(): void {
    this.updatingFromService = true;
    const filter = new FilterDTO(
      this.selectedTags.length > 0 ? this.selectedTags.map(t => t.id) : null,
      this.selectedIngredients.length > 0 ? this.selectedIngredients.map(i => i.id) : null,
      null,
      this.selectedCuisineId,
      this.rating || null,
      this.exactRating || null,
      this.creationDate || '',
      this.prepTime || null,
      this.exactPrepTime || null,
      this.cookTime || null,
      this.exactCookTime || null,
      this.totalTime || null,
      this.exactTotalTime || null
    );
    this.filterService.setFilter(filter);
    this.updatingFromService = false;

    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }

  clearFilters(): void {
    this.selectedTags = [];
    this.selectedIngredients = [];
    this.selectedCuisineId = null;
    this.rating = 0;
    this.exactRating = false;
    this.prepTime = 0;
    this.exactPrepTime = false;
    this.cookTime = 0;
    this.exactCookTime = false;
    this.totalTime = 0;
    this.exactTotalTime = false;
    this.creationDate = '';
    this.tagSearchText = '';
    this.ingredientSearchText = '';
    this.cuisineSearchText = '';
  }

  private syncFromService(filter: FilterDTO): void {
    this.selectedCuisineId = filter.cuisine;

    if (filter.tags) {
      this.selectedTags = this.availableTags.filter(t => filter.tags!.includes(t.id));
    } else {
      this.selectedTags = [];
    }

    if (filter.ingredients) {
      this.selectedIngredients = this.availableIngredients.filter(i => filter.ingredients!.includes(i.id));
    } else {
      this.selectedIngredients = [];
    }

    if (filter.rating !== null) {
      this.rating = filter.rating;
    } else {
      this.rating = 0;
    }

    this.exactRating = filter.exactRating ?? false;
    this.prepTime = filter.prepTime ?? 0;
    this.exactPrepTime = filter.exactPrepTime ?? false;
    this.cookTime = filter.cookTime ?? 0;
    this.exactCookTime = filter.exactCookTime ?? false;
    this.totalTime = filter.totalTime ?? 0;
    this.exactTotalTime = filter.exactTotalTime ?? false;
    this.creationDate = filter.creationDate ?? '';
  }
}
