import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CredentialsDTO } from '../../model/auth/credentials-dto';
import { ThemeService, Theme } from '../services/theme.service';

@Component({
  selector: 'app-login-view',
  standalone: false,
  templateUrl: './login-view.html',
  styleUrl: './login-view.css',
})
export class LoginView implements OnInit, OnDestroy {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  currentTheme!: Theme;
  private themeSubscription!: Subscription;

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
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter username and password';
      return;
    }

    const credentials = new CredentialsDTO(this.username, this.password);
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
    // TODO: Switch to registration form (not implemented yet)
    console.log('Switch to registration form');
  }
}
