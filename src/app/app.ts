import { Component, signal } from '@angular/core';
import { RecipeData } from '../model/recipe/recipe-data';
import { TagData } from '../model/tag/tag-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('RecetasFront-Angular');

  tags = [
    new TagData("Freidora de aire"),
    new TagData("Delicioso"),
    new TagData("Facil"),
    new TagData("Amarillo"),
    
  ]

  recipe = new RecipeData(
    this.tags, 
    "https://yhoyquecomemos.com/wp-content/uploads/2017/01/tarta-de-manzana-receta-1.jpg", 
    "Tarta de manzana", 
    "Tarta de manzana muy rica y vegana",
    "HomeMade",
    "https://cdng.europosters.eu/pod_public/750/175230.jpg", 
    3, 
    20, 
    30);
}
