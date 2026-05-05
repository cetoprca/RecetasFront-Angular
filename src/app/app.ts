import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService, Theme } from './services/theme.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  currentTheme!: Theme;
  private themeSubscription!: Subscription;
  isAuthenticated$: any;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => {
        this.currentTheme = theme;
      }
    );
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err: any) => console.error('Logout error:', err)
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
