import { Component, Input, OnInit } from '@angular/core';
import { RecipeData } from '../../model/recipe/recipe-data';
import { TagData } from '../../model/tag/tag-data';
import { RecipeScroll } from '../recipe-scroll/recipe-scroll';
import { ProfileHeader } from '../profile-header/profile-header';

@Component({
  selector: 'app-profile-view',
  standalone: false,
  templateUrl: './profile-view.html',
  styleUrl: './profile-view.css',
})
export class ProfileView implements OnInit {
  @Input() username: string = "Chef María";
  @Input() userHandle: string = "chefmaria";
  @Input() bio: string = "Amante de la cocina mediterránea. Compartiendo mis recetas favoritas 🍳";
  @Input() profilePicture: string = "https://randomuser.me/api/portraits/women/44.jpg";
  @Input() followers: number = 1250;
  @Input() following: number = 342;
  @Input() recipesCount: number = 28;

  recipes: RecipeData[] = [];

  ngOnInit() {
    this.loadRecipes();
  }

  private loadRecipes() {
    const profileTags = [
      new TagData("Freidora de aire"),
      new TagData("Delicioso"),
      new TagData("Facil"),
      new TagData("Amarillo"),
    ];

    const profileRecipes = [
      new RecipeData(
        1,
        profileTags,
        "https://yhoyquecomemos.com/wp-content/uploads/2017/01/tarta-de-manzana-receta-1.jpg",
        "Tarta de manzana",
        "Tarta de manzana muy rica y vegana",
        "HomeMade",
        1,
        "chef_maria",
        this.profilePicture,
        3,
        20,
        30
      ),
      new RecipeData(
        2,
        [new TagData("Postre"), new TagData("Dulce")],
        "https://images.hola.com/imagenes/cocina/recetas/20230915185337/cheesecake-vasco/1-144-979/cheesecake-vasco-t.jpg",
        "Cheesecake Vasco",
        "Cheesecake al estilo del restaurante La Viña",
        "Postre",
        1,
        "chef_maria",
        this.profilePicture,
        4,
        15,
        45
      ),
      new RecipeData(
        3,
        [new TagData("Ensalada"), new TagData("Saludable"), new TagData("Vegetal")],
        "https://www.recetasderechupete.com/wp-content/uploads/2020/05/Ensalada-de-lentejas-con-verduras-768x530.jpg",
        "Ensalada de Lentejas",
        "Ensalada fresca y nutritiva con lentejas y verduras de temporada",
        "Saludable",
        1,
        "chef_maria",
        this.profilePicture,
        4,
        10,
        25
      ),
    ];

    this.recipes = profileRecipes;
  }
}
