import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService, Theme } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { UserDTO } from '../../model/user/user-dto';

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

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => {
        this.currentTheme = theme;
      }
    );
    this.loadCurrentUser();
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  private loadCurrentUser() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => console.error('Error loading current user:', err)
    });
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
