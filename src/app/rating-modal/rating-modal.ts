import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RatingDTO } from '../../model/rating/rating-dto';
import { RatingService } from '../services/rating.service';
import { TranslateService } from '@ngx-translate/core';
import { Theme, ThemeService } from '../services/theme.service';

interface RatingForm {
  title: FormControl<string | null>;
  description: FormControl<string | null>;
  rating: FormControl<number | null>;
}

export function ratingFormValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const title = (group.get('title')?.value || '').toString().trim();
    const description = (group.get('description')?.value || '').toString().trim();
    const rating = group.get('rating')?.value || 0;
    if (!title) return { titleEmpty: true };
    if (!description) return { descriptionEmpty: true };
    if (!rating) return { ratingEmpty: true };
    return null;
  };
}

@Component({
  selector: 'app-rating-modal',
  standalone: false,
  templateUrl: './rating-modal.html',
  styleUrl: './rating-modal.css',
})
export class RatingModal {
  saving: boolean = false;
  currentTheme!: Theme;

  ratingForm = new FormGroup<RatingForm>({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    rating: new FormControl(0, [Validators.required, Validators.min(1)]),
  }, { validators: ratingFormValidator() });

  constructor(
    public dialogRef: MatDialogRef<RatingModal>,
    @Inject(MAT_DIALOG_DATA) public data: { recipeId: number },
    private themeService: ThemeService,
    private ratingService: RatingService,
    private translateService: TranslateService
  ) {
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  setRating(value: number) {
    this.ratingForm.get('rating')?.setValue(value);
  }

  getErrorMessage(field: string): string {
    const control = this.ratingForm.get(field);
    if (!control || !control.touched) return '';

    if (control.hasError('required')) {
      const keys: Record<string, string> = {
        title: 'RATING.ERRORS.TITLE_REQUIRED', description: 'RATING.ERRORS.DESC_REQUIRED', rating: 'RATING.ERRORS.RATING_REQUIRED'
      };
      return this.translateService.instant(keys[field] || '');
    }
    if (control.hasError('min')) return this.translateService.instant('RATING.ERRORS.SELECT_RATING');

    if (this.ratingForm.hasError('titleEmpty') && field === 'title') return this.translateService.instant('RATING.ERRORS.TITLE_EMPTY');
    if (this.ratingForm.hasError('descriptionEmpty') && field === 'description') return this.translateService.instant('RATING.ERRORS.DESC_EMPTY');
    if (this.ratingForm.hasError('ratingEmpty') && field === 'rating') return this.translateService.instant('RATING.ERRORS.SELECT_RATING');
    return '';
  }

  save() {
    if (this.saving || this.ratingForm.invalid) return;
    this.saving = true;

    const { title, description, rating } = this.ratingForm.value;
    const dto = new RatingDTO(0, title!, description!, rating!, "", 0);

    this.ratingService.createRating(this.data.recipeId, dto).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
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
