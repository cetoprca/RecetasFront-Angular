import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService, Theme } from '../../../services/theme.service';

@Component({
  selector: 'app-full-view',
  standalone: false,
  templateUrl: './full-view.html',
  styleUrl: './full-view.css',
})
export class FullView implements OnInit, OnDestroy {
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
}
