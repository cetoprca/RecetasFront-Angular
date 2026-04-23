import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RecipeData } from '../../model/recipe/recipe-data';
import { TagData } from '../../model/tag/tag-data';
import { ThemeService, Theme } from '../services/theme.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  standalone: false,
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css',
})
export class RecipeDetail implements OnInit, OnDestroy {
  currentTheme!: Theme;
  private themeSubscription!: Subscription;
  recipeId!: number;
  recipe: RecipeData | null = null;
  stars: Boolean[] = [];

  constructor(
    private themeService: ThemeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => {
        this.currentTheme = theme;
      }
    );

    this.route.params.subscribe(params => {
      this.recipeId = params['recipeId'];
      this.loadRecipe();
    });
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  private loadRecipe() {
    this.recipe = new RecipeData(
      this.recipeId,
      [new TagData("Postre"), new TagData("Dulce")],
      "https://images.hola.com/imagenes/cocina/recetas/20230915185337/cheesecake-vasco/1-144-979/cheesecake-vasco-t.jpg",
      "Cheesecake Vasco",
      "Cheesecake al estilo del restaurante La Viña. Una receta clásica de este delicioso postre español.",
      "Postre",
      1,
      "chef_maria",
      "https://randomuser.me/api/portraits/women/44.jpg",
      4,
      15,
      45
    );

    this.stars = [];
    for(let i = 0; i<this.recipe.stars; i++){
      this.stars[i] = true;
    }
    for(let i = 0; i<5-this.recipe.stars; i++){
      this.stars[4-i] = false;
    }
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
  }
}