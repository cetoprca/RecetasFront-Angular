import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RatingCardDTO } from '../../model/rating/rating-card-dto';
import { Theme, ThemeService } from '../services/theme.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-rating-card',
  standalone: false,
  templateUrl: './rating-card.html',
  styleUrl: './rating-card.css',
})
export class RatingCard implements OnInit, OnDestroy {
  @Input() rating: RatingCardDTO | undefined;
  currentTheme!: Theme;
  private themeSubscription!: Subscription;
  imageUrl = `${environment.apiUrl}/image/file/`;
  stars: Boolean[] = [];

  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => { this.currentTheme = theme; }
    );
    this.updateStars();
  }

  ngOnDestroy() {
    if (this.themeSubscription) { this.themeSubscription.unsubscribe(); }
  }

  private updateStars() {
    this.stars = [];
    const s = this.rating?.stars || 0;
    for (let i = 0; i < s; i++) { this.stars[i] = true; }
    for (let i = 0; i < 5 - s; i++) { this.stars[4 - i] = false; }
  }

  navigateToProfile(event: Event) {
    event.stopPropagation();
    if (this.rating?.author?.id) {
      this.router.navigate(['/profile', this.rating.author.id]);
    }
  }
}
