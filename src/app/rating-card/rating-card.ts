import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RatingCardDTO } from '../../model/rating/rating-card-dto';
import { AuthService } from '../services/auth.service';
import { RatingService } from '../services/rating.service';
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
  @Output() deleted = new EventEmitter<void>();
  currentTheme!: Theme;
  private themeSubscription!: Subscription;
  imageUrl = `${environment.apiUrl}/image/file/`;
  stars: Boolean[] = [];
  showMenu = false;

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private authService: AuthService,
    private ratingService: RatingService
  ) {}

  get isOwnRating(): boolean {
    return this.authService.currentUser$.value?.id === this.rating?.author?.id;
  }

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

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeMenu();
  }

  deleteRating(event: Event) {
    event.stopPropagation();
    this.showMenu = false;
    if (!this.rating?.id || !this.rating?.recipe) return;

    this.ratingService.deleteRating(this.rating.recipe, this.rating.id).subscribe({
      next: () => this.deleted.emit(),
      error: (err) => console.error('Error deleting rating:', err)
    });
  }

  navigateToProfile(event: Event) {
    event.stopPropagation();
    if (this.rating?.author?.id) {
      this.router.navigate(['/profile', this.rating.author.id]);
    }
  }
}
