import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Theme {
  value: string;
  name: string;
  primary: string;
  secondary: string;
  text: string;
  background: string;
  card: string;
  header: string;
  divider: string;
  tagBg: string;
  starActive: string;
  starInactive: string;
  starBg: string;
  buttonBg: string;
  buttonText: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  hoverBg: string;
  menuIcon: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themes: Theme[] = [
    {
      value: 'light',
      name: 'Claro',
      primary: 'rgb(100, 100, 100)',
      secondary: 'rgb(230, 230, 230)',
      text: 'rgb(30, 30, 30)',
      background: '#f5f5f5',
      card: 'rgb(255, 255, 255)',
      header: 'rgb(100, 100, 100)',
      divider: 'rgb(60, 60, 60)',
      tagBg: 'rgb(200, 200, 200)',
      starActive: '#f4a100',
      starInactive: 'rgb(180, 180, 180)',
      starBg: 'rgba(0, 0, 0, 0.15)',
      buttonBg: 'rgb(100, 100, 100)',
      buttonText: 'rgb(255, 255, 255)',
      inputBg: 'rgb(255, 255, 255)',
      inputBorder: 'rgb(180, 180, 180)',
      inputText: 'rgb(30, 30, 30)',
      hoverBg: 'rgba(0, 0, 0, 0.1)',
      menuIcon: 'rgb(80, 80, 80)'
    },
    {
      value: 'dark',
      name: 'Oscuro',
      primary: 'rgb(70, 70, 70)',
      secondary: 'rgb(45, 45, 45)',
      text: 'rgb(240, 240, 240)',
      background: '#121212',
      card: 'rgb(35, 35, 35)',
      header: 'rgb(25, 25, 25)',
      divider: 'rgb(200, 200, 200)',
      tagBg: 'rgb(80, 80, 80)',
      starActive: '#f4a100',
      starInactive: 'rgb(120, 120, 120)',
      starBg: 'rgba(255, 255, 255, 0.15)',
      buttonBg: 'rgb(70, 70, 70)',
      buttonText: 'rgb(240, 240, 240)',
      inputBg: 'rgb(50, 50, 50)',
      inputBorder: 'rgb(100, 100, 100)',
      inputText: 'rgb(240, 240, 240)',
      hoverBg: 'rgba(255, 255, 255, 0.1)',
      menuIcon: 'rgb(180, 180, 180)'
    },
    {
      value: 'blue',
      name: 'Azul',
      primary: 'rgb(25, 50, 85)',
      secondary: 'rgb(40, 70, 110)',
      text: 'rgb(230, 240, 255)',
      background: '#0a1628',
      card: 'rgb(30, 55, 95)',
      header: 'rgb(20, 40, 70)',
      divider: 'rgb(180, 200, 230)',
      tagBg: 'rgb(50, 90, 140)',
      starActive: '#f4a100',
      starInactive: 'rgb(120, 160, 200)',
      starBg: 'rgba(255, 255, 255, 0.15)',
      buttonBg: 'rgb(25, 50, 85)',
      buttonText: 'rgb(200, 220, 255)',
      inputBg: 'rgb(20, 40, 70)',
      inputBorder: 'rgb(80, 120, 170)',
      inputText: 'rgb(230, 240, 255)',
      hoverBg: 'rgba(255, 255, 255, 0.1)',
      menuIcon: 'rgb(160, 190, 230)'
    },
    {
      value: 'green',
      name: 'Verde',
      primary: 'rgb(35, 60, 50)',
      secondary: 'rgb(50, 80, 65)',
      text: 'rgb(230, 245, 235)',
      background: '#0f1a12',
      card: 'rgb(40, 65, 55)',
      header: 'rgb(30, 50, 40)',
      divider: 'rgb(180, 210, 190)',
      tagBg: 'rgb(60, 100, 80)',
      starActive: '#f4a100',
      starInactive: 'rgb(130, 180, 150)',
      starBg: 'rgba(255, 255, 255, 0.15)',
      buttonBg: 'rgb(35, 60, 50)',
      buttonText: 'rgb(220, 240, 225)',
      inputBg: 'rgb(30, 50, 40)',
      inputBorder: 'rgb(80, 120, 100)',
      inputText: 'rgb(230, 245, 235)',
      hoverBg: 'rgba(255, 255, 255, 0.1)',
      menuIcon: 'rgb(160, 200, 170)'
    }
  ];

  private currentThemeSubject = new BehaviorSubject<Theme>(this.themes[0]);
  currentTheme$ = this.currentThemeSubject.asObservable();

  get themesList(): Theme[] {
    return this.themes;
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.getValue();
  }

  setTheme(themeValue: string): void {
    const theme = this.themes.find(t => t.value === themeValue);
    if (theme) {
      this.currentThemeSubject.next(theme);
      this.applyThemeToDOM(theme);
    }
  }

  private applyThemeToDOM(theme: Theme): void {
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.text;
    document.body.setAttribute('data-theme', theme.value);
  }

  resetTheme(): void {
    this.setTheme('light');
  }
}
