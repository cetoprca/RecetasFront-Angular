import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService, Theme } from './services/theme.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
  showLangMenu: boolean = false;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router,
    private translateService: TranslateService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit() {
    this.translateService.setDefaultLang('es');
    const lang = localStorage.getItem('lang') || 'es';
    this.translateService.use(lang);

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

  @HostListener('document:click')
  closeLangMenu() {
    this.showLangMenu = false;
  }

  toggleLangMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showLangMenu = !this.showLangMenu;
  }

  setLanguage(lang: string) {
    localStorage.setItem('lang', lang);
    this.translateService.use(lang);
    this.showLangMenu = false;
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
