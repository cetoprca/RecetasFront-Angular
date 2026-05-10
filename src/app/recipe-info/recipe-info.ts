import { Component, OnInit, OnDestroy, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { ThemeService, Theme } from '../services/theme.service';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-recipe-info',
  standalone: false,
  templateUrl: './recipe-info.html',
  styleUrl: './recipe-info.css',
})
export class RecipeInfo implements OnInit, OnDestroy, OnChanges {
  constructor(
    private router: Router,
    private themeService: ThemeService,
    private userService: UserService
  ) {}

  @Input() recipeData!: RecipeCardDTO;
  currentTheme!: Theme;
  imageFileUrl = `${environment.apiUrl}/image/file/`;
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
    console.log(this.recipeData)
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
      const stars = this.recipeData.stars || 0;
      for(let i = 0; i<stars; i++){
        this.stars[i] = true;
      }
      for(let i = 0; i<5-stars; i++){
        this.stars[4-i] = false;
      }
    }
  }

  get imageURL(): string {
    return this.recipeData.imageURL || '';
  }

  get authorUsername(): string {
    return this.recipeData.author?.displayName || '';
  }

  get authorProfilePictureURL(): string {
    return this.recipeData.author?.profilePicturePath || '';
  }

  get cuisineDisplay(): string {
    return this.recipeData.cuisine || '';
  }

  get tagList(): any[] {
    return this.recipeData.tags || [];
  }

  get starsCount(): number {
    return this.recipeData.stars || 0;
  }

  get recipeTitle(): string {
    return this.recipeData.title;
  }

  get recipeDescription(): string {
    return this.recipeData.description;
  }

  get recipePrepTime(): number {
    return this.recipeData.prepTime;
  }

  get recipeCookTime(): number {
    return this.recipeData.cookTime;
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
    console.log('Save recipe:', this.recipeData.title, this.recipeData.id);
    this.userService.saveRecipe(this.recipeData.id);
    this.closeMenu();
  }

  shareRecipe() {
    console.log('Share recipe:', this.recipeData.title);
    this.closeMenu();
  }

  navigateToProfile(event: Event) {
    event.stopPropagation();
    if (this.recipeData.author?.id) {
      this.router.navigate(['/profile', this.recipeData.author.id]);
    }
  }

  onTagClick(event: MouseEvent) {
    console.log('Abrir enlace');
    this.router.navigate(['/tag']);
  }
}
