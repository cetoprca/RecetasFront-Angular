import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RecipeData } from '../../model/recipe/recipe-data';
import { TagData } from '../../model/tag/tag-data';
import { StepData } from '../../model/step/step-data';
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
  steps: StepData[] = [];

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

    this.steps = [
      new StepData(1, "Preparar la masa", "En un bowl, mezcla la harina, la mantequilla fría cortada en cubos y el azúcar. Agrega el huevo y amasa hasta obtener una masa homogénea.", 1, "https://www.cocinadelirante.com/sites/default/files/images/2025/05/cuales-son-los-tipos-de-mantequilla-y-en-que-recetas-se-usan.jpg", this.recipeId),
      new StepData(2, "Estirar la masa", "Estira la masa con un rodillo y forra un molde para tarta de unos 24 cm de diámetro. Pincha el fondo con un tenedor.", 2, "", this.recipeId),
      new StepData(3, "Preparar el relleno", "Pela las manzanas, córtalas en rodajas y mézclalas con azúcar, canela y un poco de jugo de limón.", 3, "", this.recipeId),
      new StepData(4, "Hornear", "Vierte el relleno sobre la masa, distribuye bien las manzanas y hornea a 180°C durante 45-50 minutos.", 4, "", this.recipeId),
    ];
  }
}