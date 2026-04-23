import { Component, ElementRef, input, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecipeData } from '../../model/recipe/recipe-data';
import { ThemeService, Theme } from '../../../services/theme.service';

@Component({
  selector: 'app-recipe-card',
  standalone: false,
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.css',
})
export class RecipeCard implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {}

  @Input() recipeData!: RecipeData;
  currentTheme!: Theme;
  private themeSubscription!: Subscription;

  ngOnInit(){
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => {
        this.currentTheme = theme;
      }
    );
    for(let i = 0; i<this.recipeData.stars; i++){
      this.stars[i] = true;
    }
    for(let i = 0; i<4-this.recipeData.stars; i++){
      this.stars[4-i] = false;
    }
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  stars : Boolean[] = [];

  showMenu = false;

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

  onTagClick(event: MouseEvent) {
    if (this.moved) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    console.log('Abrir enlace');
    this.router.navigate(['/tag']);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.parentElement?.remove();
  }

  openRecipe() {
    if (this.recipeData && this.recipeData.id) {
      this.router.navigate(['/recipe', this.recipeData.id]);
    }
  }
}