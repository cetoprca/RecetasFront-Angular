import { Component, Input, OnInit } from '@angular/core';
import { RecipeData } from '../../model/recipe/recipe-data';
import { TagData } from '../../model/tag/tag-data';
import { RecipeScroll } from '../recipe-scroll/recipe-scroll';

@Component({
  selector: 'app-feed-view',
  standalone: false,
  templateUrl: './feed-view.html',
  styleUrl: './feed-view.css',
})
export class FeedView implements OnInit {
  recipes: RecipeData[] = [];

  ngOnInit() {
    this.loadRecipes();
  }

  private loadRecipes() {
    const feedRecipes = [
      new RecipeData(
        [new TagData("Freidora de aire"), new TagData("Delicioso"), new TagData("Facil"), new TagData("Facil"), new TagData("Facil"), new TagData("Facil"), new TagData("Facil"), new TagData("Facil"), new TagData("Facil"), new TagData("Facil"), new TagData("Facil"), new TagData("Facil"), ],
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
        [new TagData("Ensalada"), new TagData("Saludable"), new TagData("Vegetal")],
        "https://www.recetasderechupete.com/wp-content/uploads/2020/05/Ensalada-de-lentejas-con-verduras-768x530.jpg",
        "Ensalada de Lentejas",
        "Ensalada fresca y nutritiva con lentejas y verduras de temporada",
        "Saludable",
        "https://randomuser.me/api/portraits/men/32.jpg",
        4,
        10,
        25
      ),
      new RecipeData(
        [new TagData("Pasta"), new TagData("Italiana"), new TagData("Queso")],
        "https://www.clarin.com/img/2023/02/23/lasagna_70_RZZDOB1S_2000x1500__1.jpg",
        "Lasagna Casera",
        "Lasagna tradicional italiana con carne y queso mozzarella",
        "Italiana",
        "https://randomuser.me/api/portraits/women/68.jpg",
        3,
        30,
        60
      ),
    ];

    this.recipes = feedRecipes;
  }
}
