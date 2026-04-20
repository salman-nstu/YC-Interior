import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'admin-dark-mode';
  
  // Initialize from localStorage or default to false
  darkMode = signal(this.getStoredTheme());

  constructor() {
    // Apply theme on initialization
    this.applyTheme(this.darkMode());
    
    // Watch for changes and persist them
    effect(() => {
      const isDark = this.darkMode();
      this.applyTheme(isDark);
      this.storeTheme(isDark);
    });
  }

  toggleTheme(): void {
    this.darkMode.update(current => !current);
  }

  private getStoredTheme(): boolean {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored === 'true';
  }

  private storeTheme(isDark: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, isDark.toString());
  }

  private applyTheme(isDark: boolean): void {
    if (typeof document === 'undefined') return;
    
    const body = document.body;
    const html = document.documentElement;
    
    if (isDark) {
      body.classList.add('dark-mode');
      html.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
      html.classList.remove('dark-mode');
    }
  }
}