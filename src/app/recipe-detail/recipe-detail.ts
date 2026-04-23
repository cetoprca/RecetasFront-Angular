import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RecipeData } from '../../model/recipe/recipe-data';
import { TagData } from '../../model/tag/tag-data';
import { ThemeService, Theme } from '../services/theme.service';
import { ActivatedRoute } from '@angular/router';
import { RecipeInfo } from '../recipe-info/recipe-info';

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
      "https://cdn.blog.paulinacocina.net/wp-content/uploads/2024/01/pastel-de-manzana-con-hojaldre-Paulina-Cocina-Recetas-1722251870.jpg",
      "Tarta de Manzana",
      "Tarta de manzana muy rica y vegana. Una receta clásica que nunca pasa de moda.",
      "Postre",
      1,
      "chef_maria",
      "https://randomuser.me/api/portraits/women/44.jpg",
      4,
      20,
      30
    );
  }
}