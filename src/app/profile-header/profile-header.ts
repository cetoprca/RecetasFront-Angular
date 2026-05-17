import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService, Theme } from '../services/theme.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile-header',
  standalone: false,
  templateUrl: './profile-header.html',
  styleUrl: './profile-header.css',
})
export class ProfileHeader implements OnInit, OnDestroy {

  @Input() username: string = "Chef María";
  @Input() userHandle: string = "chefmaria";
  @Input() bio: string = "Amante de la cocina mediterránea. Compartiendo mis recetas favoritas 🍳";
  @Input() profilePicture: string = "https://randomuser.me/api/portraits/women/44.jpg";
  @Input() followers: number = 1250;
  @Input() following: number = 342;
  @Input() recipesCount: number = 28;
  @Input() isOwnProfile: boolean = true;
  @Input() isFollowing: boolean = false;

  currentTheme!: Theme;
  private themeSubscription!: Subscription;
  imageUrl = `${environment.apiUrl}/image/file/`;

  constructor(private themeService: ThemeService, private router: Router, private userService: UserService, private authService: AuthService) {}

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

  navigateToProfile() {
    if (this.isOwnProfile) {
      this.router.navigate(['/profile']);
    }
  }

  navigateToEditProfile() {
    this.router.navigate(['/profile/edit']);
  }

  toggleFollow() {
    this.userService.toggleFollow(this.userHandle).subscribe({
      next: (updatedUser) => {
        this.isFollowing = !this.isFollowing;
        this.followers += this.isFollowing ? 1 : -1;
        this.authService.currentUser$.next(updatedUser);
      },
      error: (err) => console.error('Error toggling follow status:', err)
    });
  }
}
