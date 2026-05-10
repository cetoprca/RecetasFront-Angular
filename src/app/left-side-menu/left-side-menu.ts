import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService, Theme } from '../services/theme.service';
import { FilterService } from '../services/filter.service';
import { AuthService } from '../services/auth.service';
import { UserDTO } from '../../model/user/user-dto';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-left-side-menu',
  standalone: false,
  templateUrl: './left-side-menu.html',
  styleUrl: './left-side-menu.css',
})
export class LeftSideMenu implements OnInit, OnDestroy {
  currentTheme!: Theme;
  private themeSubscription!: Subscription;
  currentUser: UserDTO | null = null;

  imageUrl = `${environment.apiUrl}/image/file/`;

  private authSubscription!: Subscription;

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private authService: AuthService,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => {
        this.currentTheme = theme;
      }
    );
    this.authSubscription = this.authService.currentUser$.subscribe(
      (user) => {
        this.currentUser = user;
      }
    );
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  navigateToFeed() {
    this.filterService.resetFilter();
    this.router.navigate(['/']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => console.error('Logout error:', err)
    });
  }
}
