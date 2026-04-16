import { Component, Input, OnInit } from '@angular/core';
import { RecipeData } from '../../model/recipe/recipe-data';
import { TagData } from '../../model/tag/tag-data';
import { RecipeScroll } from '../recipe-scroll/recipe-scroll';
import { SavedHeader } from '../saved-header/saved-header';

@Component({
  selector: 'app-saved-view',
  standalone: false,
  templateUrl: './saved-view.html',
  styleUrl: './saved-view.css',
})
export class SavedView implements OnInit {
  @Input() savedCount: number = 0;

  recipes: RecipeData[] = [];

  ngOnInit() {
    this.loadSavedRecipes();
  }

  private loadSavedRecipes() {
    const savedTags = [
      new TagData("Favorito"),
      new TagData("Para probar"),
      new TagData("Facil"),
    ];

    const savedRecipes = [
      new RecipeData(
        savedTags,
        "https://yhoyquecomemos.com/wp-content/uploads/2017/01/tarta-de-manzana-receta-1.jpg",
        "Tarta de manzana",
        "Tarta de manzana muy rica y vegana",
        "HomeMade",
        "https://cdng.europosters.eu/pod_public/750/175230.jpg",
        3,
        20,
        30
      ),
      new RecipeData(
        [new TagData("Postre"), new TagData("Dulce")],
        "https://images.hola.com/imagenes/cocina/recetas/20230915185337/cheesecake-vasco/1-144-979/cheesecake-vasco-t.jpg",
        "Cheesecake Vasco",
        "Cheesecake al estilo del restaurante La Viña",
        "Postre",
        "https://randomuser.me/api/portraits/women/44.jpg",
        4,
        15,
        45
      ),
      new RecipeData(
        [new TagData("Pasta"), new TagData("Italiana"), new TagData("Queso")],
        "https://www.clarin.com/img/2023/02/23/lasagna_70_RZZDOB1S_2000x1500__1.jpg",
        "Lasagna Casera",
        "Lasagna tradicional italiana con carne y queso mozzarella",
        "Italiana",
        "https://randomuser.me/api/portraits/men/32.jpg",
        3,
        30,
        60
      ),
      new RecipeData(
        [new TagData("Sopa"), new TagData("Caliente"), new TagData("Verano")],
        "https://www.recetasderechupete.com/wp-content/uploads/2021/01/gazpacho-andaluz-1080x671.jpg",
        "Gazpacho Andaluz",
        "Sopa fría tradicional de Andalucía, perfecta para el verano",
        "Español",
        "https://randomuser.me/api/portraits/women/68.jpg",
        4,
        15,
        0
      ),
      new RecipeData(
        [new TagData("Arroz"), new TagData("Marisco"), new TagData("Valencia")],
        "https://cdn.defunctmedia.com/paulinacoock/media/images/recetas/paella_valenciana_original.webp",
        "Paella Valenciana",
        "Paella tradicional Valenciana con pollo y conejo",
        "Valenciana",
        "https://randomuser.me/api/portraits/men/75.jpg",
        4,
        20,
        40
      ),
    ];

    this.recipes = savedRecipes;
    this.savedCount = savedRecipes.length;
  }
}
