import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CredentialsDTO } from '../../model/auth/credentials-dto';
import { sha256 } from '../utils/hash';
import { ThemeService, Theme } from '../services/theme.service';

@Component({
  selector: 'app-login-view',
  standalone: false,
  templateUrl: './login-view.html',
  styleUrl: './login-view.css',
})
export class LoginView implements OnInit, OnDestroy {
  handle: string = '';
  password: string = '';
  errorMessage: string = '';
  currentTheme!: Theme;
  private themeSubscription!: Subscription;
  private authSubscription!: Subscription;

  constructor(
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
    
    // Redirect if already logged in
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

  async onLogin() {
    if (!this.handle || !this.password) {
      this.errorMessage = 'Please enter handle and password';
      return;
    }

    const hashedPassword = await sha256(this.password);
    const credentials = new CredentialsDTO(this.handle, hashedPassword);
    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = 'Invalid credentials';
        console.error('Login error:', err);
      }
    });
  }

  onRegister() {
    this.router.navigate(['/register']);
  }
}
