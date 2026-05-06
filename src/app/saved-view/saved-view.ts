import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeCardDTO } from '../../model/recipe/recipe-card-dto';
import { RecipeScroll } from '../recipe-scroll/recipe-scroll';
import { SavedHeader } from '../saved-header/saved-header';

@Component({
  selector: 'app-saved-view',
  standalone: false,
  templateUrl: './saved-view.html',
  styleUrl: './saved-view.css',
})
export class SavedView implements OnInit {
  savedCount: number = 0;
  recipes: RecipeCardDTO[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    console.log('SavedView: Initializing with resolved saved recipes');
    
    // Get saved recipes from resolver
    this.recipes = this.route.snapshot.data['recipes'];
    this.savedCount = this.recipes.length;
  }
}
