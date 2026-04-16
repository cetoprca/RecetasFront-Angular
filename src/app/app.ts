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
}
