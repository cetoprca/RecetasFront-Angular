import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-card',
  standalone: false,
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.css',
})
export class RecipeCard {
  constructor(private router: Router) {}

  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  startDrag(event: MouseEvent) {
    const container = event.currentTarget as HTMLElement;
    this.isDragging = false;
    this.startX = event.pageX - container.offsetLeft;
  }

  onDrag(event: MouseEvent) {
    const container = event.currentTarget as HTMLElement;

    const x = event.pageX - container.offsetLeft;
    const walk = Math.abs(x - this.startX);

    if (walk > 5) { // umbral para considerar drag
      this.isDragging = true;
      container.scrollLeft -= (x - this.startX);
    }
  }

  endDrag() {
      setTimeout(() => {
        this.isDragging = false;
      });
    }

  onTagClick(event: MouseEvent) {
    if (this.isDragging) return;


    this.router.navigate(['/tag']);
  }
}
