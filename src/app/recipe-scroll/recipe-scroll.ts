import { Component, Input } from '@angular/core';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { RecipeCard } from '../recipe-card/recipe-card';

@Component({
  selector: 'app-recipe-scroll',
  standalone: false,
  templateUrl: './recipe-scroll.html',
  styleUrl: './recipe-scroll.css',
})
export class RecipeScroll {
  @Input() recipes: RecipeCardDTO[] = [];
}
