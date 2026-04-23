import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { ThemeService, Theme } from '../../../services/theme.service';

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

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => {
        this.currentTheme = theme;
      }
    );
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  selectedTags: FilterOption[] = [];
  availableTags: FilterOption[] = [
    { id: 1, name: 'Freidora de aire' },
    { id: 2, name: 'Delicioso' },
    { id: 3, name: 'Fácil' },
    { id: 4, name: 'Postre' },
    { id: 5, name: 'Dulce' },
    { id: 6, name: 'Ensalada' },
    { id: 7, name: 'Saludable' },
    { id: 8, name: 'Pasta' },
    { id: 9, name: 'Italiana' },
    { id: 10, name: 'Vegetariano' },
    { id: 11, name: 'Vegano' },
    { id: 12, name: 'Carnes' },
    { id: 13, name: 'Pescado' },
    { id: 14, name: 'Marisco' },
    { id: 15, name: 'Sopa' },
    { id: 16, name: 'Arroz' },
  ];

  selectedIngredients: FilterOption[] = [];
  availableIngredients: FilterOption[] = [
    { id: 1, name: 'Pollo' },
    { id: 2, name: 'Carne de cerdo' },
    { id: 3, name: 'Carne de vaca' },
    { id: 4, name: 'Pescado' },
    { id: 5, name: 'Mariscos' },
    { id: 6, name: 'Arroz' },
    { id: 7, name: 'Pasta' },
    { id: 8, name: 'Patatas' },
    { id: 9, name: 'Tomate' },
    { id: 10, name: 'Cebolla' },
    { id: 11, name: 'Ajo' },
    { id: 12, name: 'Pimiento' },
    { id: 13, name: 'Zanahoria' },
    { id: 14, name: 'Lechuga' },
    { id: 15, name: 'Queso' },
    { id: 16, name: 'Huevo' },
    { id: 17, name: 'Leche' },
    { id: 18, name: 'Harina' },
    { id: 19, name: 'Azúcar' },
    { id: 20, name: 'Aceite de oliva' },
    { id: 21, name: 'Mantequilla' },
    { id: 22, name: 'Limón' },
    { id: 23, name: 'AOVE' },
    { id: 24, name: 'Hierbas provenzales' },
  ];

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
    const filters = {
      tags: this.selectedTags.map(t => t.id),
      ingredients: this.selectedIngredients.map(i => i.id),
      rating: this.rating,
      exactRating: this.exactRating,
      prepTime: this.prepTime,
      exactPrepTime: this.exactPrepTime,
      cookTime: this.cookTime,
      exactCookTime: this.exactCookTime,
      totalTime: this.totalTime,
      exactTotalTime: this.exactTotalTime,
      creationDate: this.creationDate || null
    };
    console.log('Applying filters:', filters);
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
