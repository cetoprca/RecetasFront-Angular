import { Component, ElementRef, input, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeData } from '../../model/recipe/recipe-data';

@Component({
  selector: 'app-recipe-card',
  standalone: false,
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.css',
})
export class RecipeCard {
  constructor(private router: Router) {}

  @Input() recipeData!: RecipeData;

  ngOnInit(){
    for(let i = 0; i<this.recipeData.stars; i++){
      this.stars[i] = true;
    }
    for(let i = 0; i<4-this.recipeData.stars; i++){
      this.stars[4-i] = false;
    }
  }

  stars : Boolean[] = [];

  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;
  private moved = false;

  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.moved = false;
    this.startX = event.pageX;
    this.scrollLeft = (event.currentTarget as HTMLElement).scrollLeft;
  }

  onDrag(event: MouseEvent) {
    if (!this.isDragging) return;

    const container = event.currentTarget as HTMLElement;
    const x = event.pageX;
    const walk = x - this.startX;

    if (Math.abs(walk) > 5) {
      this.moved = true;
    }

    container.scrollLeft = this.scrollLeft - walk;
  }

  endDrag() {
    this.isDragging = false;
  }

  onTagClick(event: MouseEvent) {
    if (this.moved) {
      // Si hubo scroll, bloqueamos el click
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Aquí sí puedes navegar
    console.log('Abrir enlace');
    this.router.navigate(['/tag']);
  }
}