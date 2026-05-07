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

  constructor(
    private themeService: ThemeService,
    private filterService: FilterService,
    private router: Router,
    private tagService: TagService,
    private ingredientService: IngredientService
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
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  selectedTags: FilterOption[] = [];
  availableTags: FilterOption[] = [];

  selectedIngredients: FilterOption[] = [];
  availableIngredients: FilterOption[] = [];

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

  toggleSection(section: string): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  toggleTagDropdown(): void {
    this.showTagDropdown = !this.showTagDropdown;
    this.showIngredientDropdown = false;
  }

  toggleIngredientDropdown(): void {
    this.showIngredientDropdown = !this.showIngredientDropdown;
    this.showTagDropdown = false;
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
    const filter = new FilterDTO(
      this.selectedTags.length > 0 ? this.selectedTags.map(t => t.id) : null,
      this.selectedIngredients.length > 0 ? this.selectedIngredients.map(i => i.id) : null,
      null,
      null,
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

    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }

  clearFilters(): void {
    this.selectedTags = [];
    this.selectedIngredients = [];
    this.rating = 0;
    this.exactRating = false;
    this.prepTime = 0;
    this.exactPrepTime = false;
    this.cookTime = 0;
    this.exactCookTime = false;
    this.totalTime = 0;
    this.exactTotalTime = false;
    this.creationDate = '';
  }
}
