import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RatingDTO } from '../../model/rating/rating-dto';
import { RatingService } from '../services/rating.service';
import { Theme, ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-rating-modal',
  standalone: false,
  templateUrl: './rating-modal.html',
  styleUrl: './rating-modal.css',
})
export class RatingModal {
  title: string = "";
  description: string = "";
  rating: number = 0;
  saving: boolean = false;
  currentTheme!: Theme;

  constructor(
    public dialogRef: MatDialogRef<RatingModal>,
    @Inject(MAT_DIALOG_DATA) public data: { recipeId: number },
    private themeService: ThemeService,
    private ratingService: RatingService
  ) {
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  setRating(value: number) {
    this.rating = value;
  }

  save() {
    if (this.saving || this.rating === 0) return;
    this.saving = true;

    const dto = new RatingDTO(0, this.title, this.description, this.rating, "", 0);

    this.ratingService.createRating(this.data.recipeId, dto).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error creating rating:', err);
        this.saving = false;
      }
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
