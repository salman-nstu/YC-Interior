import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SettingsService } from '../../../shared/services/settings.service';
import { ApplicationSettings } from '../../../shared/models/settings.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="hero" id="home">
      <div class="hero-content">
        <h1 class="hero-title">{{ settings?.siteName || 'YC INTERIOR & BUILDERS' }}</h1>
        <p class="hero-subtitle">every space tells a story</p>
        <button class="btn-primary" (click)="navigateToContact()">get free consultation →</button>
      </div>
    </header>
  `,
  styles: [`
    .hero {
      height: 100vh;
      /* HERO BACKGROUND IMAGE - Change the filename below to use a different image from /yc-assets/ folder */
      background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
                  url('/yc-assets/download5.png') center/cover no-repeat;
      display: flex;
      flex-direction: column;
      color: var(--color-white);
      position: relative;
    }

    .hero-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 2rem;
    }

    .hero-title {
      font-size: 4rem;
      font-weight: 400;
      margin-bottom: 0.5rem;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      font-weight: 300;
      letter-spacing: 1px;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-subtitle {
        font-size: 1rem;
      }
    }
  `]
})
export class HeroComponent implements OnInit {
  settings: ApplicationSettings | null = null;
  environment = environment;

  constructor(
    private settingsService: SettingsService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Hero component loading settings...');
    this.settingsService.getSettings().subscribe({
      next: (response) => {
        console.log('Settings API Response:', response);
        if (response.success && response.data) {
          this.settings = response.data;
          console.log('Settings loaded:', this.settings);
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error loading settings:', error);
      }
    });
  }

  navigateToContact() {
    this.router.navigate(['/contact']);
  }
}
