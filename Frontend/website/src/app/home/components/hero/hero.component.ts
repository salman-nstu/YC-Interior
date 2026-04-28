import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SettingsService } from '../../../shared/services/settings.service';
import { AnimationsService } from '../../../shared/services/animations.service';
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
      width: 100%;
      /* HERO BACKGROUND IMAGE - Change the filename below to use a different image from /yc-assets/ folder */
      background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
                  url('/yc-assets/download5.png') center/cover no-repeat;
      display: flex;
      flex-direction: column;
      color: var(--color-white);
      position: relative;
      overflow: hidden;
      transform-origin: center center;
    }

    .hero-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 2rem;
      width: 100%;
      box-sizing: border-box;
    }

    .hero-title {
      font-family: 'Circular Std', sans-serif;
      font-size: 5rem;
      font-weight: 400;
      margin-bottom: 0.5rem;
      letter-spacing: 2px;
      text-transform: uppercase;
      max-width: 100%;
    }

    .hero-subtitle {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 2rem;
      margin-bottom: 2rem;
      font-weight: 300;
      letter-spacing: 1px;
    }

    .btn-primary {
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .btn-primary::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: left 0.6s ease;
    }

    .btn-primary:hover::before {
      left: 100%;
    }

    @media (max-width: 768px) {
      .hero {
        height: 80vh;
      }
      
      .hero-content {
        padding: 1.5rem;
      }
      
      .hero-title {
        font-size: 2rem;
        letter-spacing: 1px;
      }
      
      .hero-subtitle {
        font-size: 1rem;
      }
    }
  `]
})
export class HeroComponent implements OnInit, AfterViewInit {
  settings: ApplicationSettings | null = null;
  environment = environment;

  constructor(
    private settingsService: SettingsService,
    private animationsService: AnimationsService,
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

  ngAfterViewInit() {
    // Initialize hero animations after view is ready
    setTimeout(() => {
      this.animationsService.initHeroAnimations();
    }, 100);
    
    // Fallback: Ensure elements are visible if animations fail
    setTimeout(() => {
      const title = document.querySelector('.hero-title') as HTMLElement;
      const subtitle = document.querySelector('.hero-subtitle') as HTMLElement;
      const button = document.querySelector('.btn-primary') as HTMLElement;
      
      if (title && getComputedStyle(title).opacity === '0') {
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
      }
      if (subtitle && getComputedStyle(subtitle).opacity === '0') {
        subtitle.style.opacity = '1';
        subtitle.style.transform = 'translateY(0)';
      }
      if (button && getComputedStyle(button).opacity === '0') {
        button.style.opacity = '1';
        button.style.transform = 'translateY(0)';
      }
    }, 2000);
  }

  navigateToContact() {
    this.router.navigate(['/contact']);
  }
}
