import { Component, Input } from '@angular/core';
import { RecipeData } from '../../model/recipe/recipe-data';
import { RecipeCard } from '../recipe-card/recipe-card';

@Component({
  selector: 'app-recipe-scroll',
  standalone: false,
  templateUrl: './recipe-scroll.html',
  styleUrl: './recipe-scroll.css',
})
export class RecipeScroll {
  @Input() recipes: RecipeData[] = [];
}
