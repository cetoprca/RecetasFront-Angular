import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ThemeService, Theme } from '../services/theme.service';

@Component({
  selector: 'app-settings-view',
  standalone: false,
  templateUrl: './settings-view.html',
  styleUrl: './settings-view.css',
})
export class SettingsView implements OnInit, OnDestroy {
  selectedTheme: string = 'light';
  themes: Theme[] = [];
  currentTheme!: Theme;
  private themeSubscription!: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themes = this.themeService.themesList;
    this.selectedTheme = this.currentTheme.value;
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

  applyTheme() {
    this.themeService.setTheme(this.selectedTheme);
  }

  resetTheme() {
    this.themeService.resetTheme();
    this.selectedTheme = 'light';
  }
}
