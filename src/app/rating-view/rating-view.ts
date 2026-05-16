import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
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
    private router: Router,
    private ratingService: RatingService,
    private themeService: ThemeService
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
        return child.snapshot.params['recipeId'];
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
}
