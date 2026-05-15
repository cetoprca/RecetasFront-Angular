import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { filter, map, catchError, startWith, switchMap } from 'rxjs/operators';
import { RatingCardDTO } from '../../model/rating/rating-card-dto';
import { RatingDTO } from '../../model/rating/rating-dto';
import { RatingService } from '../services/rating.service';
import { UserService } from '../services/user.service';
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
    private userService: UserService,
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
        if (!recipeId) { return of([] as RatingCardDTO[]); }
        return this.ratingService.getRatingsByRecipeId(Number(recipeId)).pipe(
          switchMap((ratings: RatingDTO[]) => {
            if (ratings.length === 0) { return of([] as RatingCardDTO[]); }
            const observables = ratings.map(r =>
              this.userService.getUserById(r.author).pipe(
                map(user => new RatingCardDTO(r.id, r.title, r.description, r.stars, user, r.recipe)),
                catchError(() => of(new RatingCardDTO(r.id, r.title, r.description, r.stars, null, r.recipe)))
              )
            );
            return forkJoin(observables);
          }),
          catchError(() => of([] as RatingCardDTO[]))
        );
      })
    ).subscribe(cards => { this.ratings = cards; });
  }

  ngOnDestroy() {
    if (this.themeSubscription) { this.themeSubscription.unsubscribe(); }
    if (this.routeSubscription) { this.routeSubscription.unsubscribe(); }
  }
}
