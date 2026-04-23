import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService, Theme } from '../../../services/theme.service';

@Component({
  selector: 'app-left-side-menu',
  standalone: false,
  templateUrl: './left-side-menu.html',
  styleUrl: './left-side-menu.css',
})
export class LeftSideMenu implements OnInit, OnDestroy {
  currentTheme!: Theme;
  private themeSubscription!: Subscription;

  constructor(private themeService: ThemeService) {}

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

  username: string = "Chef María";
  profilePicture: string = "https://randomuser.me/api/portraits/women/44.jpg";
}
