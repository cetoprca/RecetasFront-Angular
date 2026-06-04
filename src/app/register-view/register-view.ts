import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { CredentialsDTO } from '../../model/auth/credentials-dto';
import { sha256 } from '../utils/hash';
import { ThemeService, Theme } from '../services/theme.service';

@Component({
  selector: 'app-register-view',
  standalone: false,
  templateUrl: './register-view.html',
  styleUrl: './register-view.css',
})
export class RegisterView implements OnInit, OnDestroy {
  handle: string = '';
  displayName: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  currentTheme!: Theme;
  private themeSubscription!: Subscription;
  private authSubscription!: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeSubscription = this.themeService.currentTheme$.subscribe(
      (theme) => {
        this.currentTheme = theme;
      }
    );

    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async onRegister() {
    this.errorMessage = '';

    if (!this.handle || !this.displayName || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.password.length < 4) {
      this.errorMessage = 'Password must be at least 4 characters';
      return;
    }

    const hashedPassword = await sha256(this.password);
    const credentials = new CredentialsDTO(this.handle, hashedPassword, this.displayName);
    this.userService.register(credentials).subscribe({
      next: () => {
        this.authService.login(credentials).subscribe({
          next: () => {
            this.router.navigate(['/profile/edit']);
          },
          error: () => {
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Registration failed. The handle may already be taken.';
        console.error('Registration error:', err);
      }
    });
  }

  onLogin() {
    this.router.navigate(['/login']);
  }
}
