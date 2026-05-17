import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { RatingCardDTO } from '../../model/rating/rating-card-dto';
import { RatingService } from '../services/rating.service';
import { Theme, ThemeService } from '../services/theme.service';
import { RatingModal } from '../rating-modal/rating-modal';

@Component({
  selector: 'app-rating-view',
  standalone: false,
  templateUrl: './rating-view.html',
  styleUrl: './rating-view.css',
})
export class RatingView implements OnInit, OnDestroy {
  ratings: RatingCardDTO[] = [];
  currentTheme!: Theme;
  currentRecipeId: number | null = null;
  private themeSubscription!: Subscription;
  private routeSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ratingService: RatingService,
    private themeService: ThemeService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => { this.currentTheme = theme; }
    );

    this.routeSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(null),
      map(() => {
        let child = this.route;
        while (child.firstChild) { child = child.firstChild; }
        const recipeId = child.snapshot.params['recipeId'];
        this.currentRecipeId = recipeId ? Number(recipeId) : null;
        return this.currentRecipeId;
      }),
      switchMap(recipeId => {
        if (!recipeId) {
          this.ratingService.setCurrentRatings([]);
          return of([] as RatingCardDTO[]);
        }
        return this.ratingService.currentRatings$;
      })
    ).subscribe(cards => { this.ratings = cards; });
  }

  ngOnDestroy() {
    if (this.themeSubscription) { this.themeSubscription.unsubscribe(); }
    if (this.routeSubscription) { this.routeSubscription.unsubscribe(); }
  }

  onRatingDeleted(ratingId: number) {
    this.ratings = this.ratings.filter(r => r.id !== ratingId);
    this.ratingService.setCurrentRatings(this.ratings);
  }

  openRatingModal() {
    if (!this.currentRecipeId) return;

    const dialogRef = this.dialog.open(RatingModal, {
      data: { recipeId: this.currentRecipeId },
      width: '450px'
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.ratingService.getRatingCardsByRecipeId(this.currentRecipeId!).subscribe({
            next: (cards) => this.ratingService.setCurrentRatings(cards),
            error: (err) => console.error('Error refreshing ratings:', err)
          });
        }
      }
    });
  }
}
