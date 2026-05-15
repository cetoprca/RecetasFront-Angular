import { Component, Input } from '@angular/core';
import { RatingDTO } from '../../model/rating/rating-dto';
import { Router } from '@angular/router';
import { Theme, ThemeService } from '../services/theme.service';
import { FilterService } from '../services/filter.service';
import { CuisineService } from '../services/cuisine.service';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rating-card',
  standalone: false,
  templateUrl: './rating-card.html',
  styleUrl: './rating-card.css',
})
export class RatingCard {
  @Input() rating: RatingDTO | undefined;
  currentTheme!: Theme;
  private themeSubscription!: Subscription;

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private filterService: FilterService,
    private cuisineService: CuisineService,
    private userService: UserService
  ) {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => {
        this.currentTheme = theme;
      }
    );
  }

}
