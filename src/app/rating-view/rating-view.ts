import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RatingCardDTO } from '../../model/rating/rating-card-dto';
import { RatingService } from '../services/rating.service';
import { Theme, ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-rating-view',
  standalone: false,
  templateUrl: './rating-view.html',
  styleUrl: './rating-view.css',
})
export class RatingView implements OnInit, OnDestroy {
  ratings: RatingCardDTO[] = [];
  currentTheme!: Theme;
  private themeSubscription!: Subscription;
  private routeSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private ratingService: RatingService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => { this.currentTheme = theme; }
    );

    let child = this.route;
    while (child.firstChild) { child = child.firstChild; }

    this.routeSubscription = child.params.pipe(
      map(params => params['recipeId']),
      switchMap(recipeId => {
        if (!recipeId) { return of([] as RatingCardDTO[]); }
        return this.ratingService.getRatingCardsByRecipeId(Number(recipeId));
      })
    ).subscribe(cards => { this.ratings = cards; });
  }

  ngOnDestroy() {
    if (this.themeSubscription) { this.themeSubscription.unsubscribe(); }
    if (this.routeSubscription) { this.routeSubscription.unsubscribe(); }
  }
}
