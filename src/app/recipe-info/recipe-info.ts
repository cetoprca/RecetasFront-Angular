import { Component, OnInit, OnDestroy, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecipeData } from '../../model/recipe/recipe-data';
import { ThemeService, Theme } from '../services/theme.service';

@Component({
  selector: 'app-recipe-info',
  standalone: false,
  templateUrl: './recipe-info.html',
  styleUrl: './recipe-info.css',
})
export class RecipeInfo implements OnInit, OnDestroy, OnChanges {
  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {}

  @Input() recipeData!: RecipeData;
  currentTheme!: Theme;
  private themeSubscription!: Subscription;
  stars: Boolean[] = [];
  showMenu = false;

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => {
        this.currentTheme = theme;
      }
    );
    this.updateStars();
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['recipeData'] && this.recipeData) {
      this.updateStars();
    }
  }

  private updateStars() {
    this.stars = [];
    if (this.recipeData) {
      for(let i = 0; i<this.recipeData.stars; i++){
        this.stars[i] = true;
      }
      for(let i = 0; i<5-this.recipeData.stars; i++){
        this.stars[4-i] = false;
      }
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

  saveRecipe() {
    console.log('Save recipe:', this.recipeData.title);
    this.closeMenu();
  }

  shareRecipe() {
    console.log('Share recipe:', this.recipeData.title);
    this.closeMenu();
  }

  onTagClick(event: MouseEvent) {
    console.log('Abrir enlace');
    this.router.navigate(['/tag']);
  }
}