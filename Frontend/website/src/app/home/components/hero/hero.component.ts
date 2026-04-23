import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../../shared/services/settings.service';
import { ApplicationSettings } from '../../../shared/models/settings.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="hero">
      <nav class="navbar">
        <div class="container nav-content">
          <div class="logo">
            <div class="logo-icon">
              <img 
                *ngIf="settings?.logoMedia?.url" 
                [src]="settings?.logoMedia?.url" 
                [alt]="settings?.siteName || 'Logo'"
              />
              <svg *ngIf="!settings?.logoMedia?.url" width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="19" stroke="currentColor" stroke-width="2"/>
                <text x="20" y="26" text-anchor="middle" font-size="16" font-weight="600" fill="currentColor">YC</text>
              </svg>
            </div>
          </div>
          <ul class="nav-links">
            <li><a href="#home">HOME</a></li>
            <li><a href="#about">ABOUT</a></li>
            <li><a href="#projects">PROJECTS</a></li>
            <li><a href="#contact">CONTACT</a></li>
            <li><a href="#services">SERVICES</a></li>
          </ul>
        </div>
      </nav>

      <div class="hero-content">
        <h1 class="hero-title">{{ settings?.siteName || 'YC INTERIOR & BUILDERS' }}</h1>
        <p class="hero-subtitle">every space tells a story</p>
        <button class="btn-primary">get free consultation →</button>
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

    .navbar {
      padding: 1.5rem 0;
      background: #EAE8DC;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
    }

    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      
      .logo-icon {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-white);
        border-radius: 50%;
        padding: 5px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        svg {
          color: var(--color-primary-dark);
        }
      }
    }

    .nav-links {
      display: flex;
      gap: 3rem;
      list-style: none;
      align-items: center;
      
      a {
        font-size: 0.9rem;
        font-weight: 500;
        letter-spacing: 0.5px;
        color: var(--color-text-dark);
        transition: color 0.3s;
        text-transform: uppercase;
        
        &:hover {
          color: var(--color-primary);
        }
      }
      
      li {
        position: relative;
        
        &::before {
          content: '•';
          position: absolute;
          left: -1.5rem;
          color: var(--color-text-dark);
          opacity: 0.5;
        }
        
        &:first-child::before {
          display: none;
        }
      }
    }

    .hero-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 2rem;
      padding-top: 8rem;
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
      .nav-links {
        display: none;
      }
      
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('Hero component loading settings...');
    this.settingsService.getSettings().subscribe({
      next: (response) => {
        console.log('Settings API Response:', response);
        if (response.success && response.data) {
          this.settings = response.data;
          console.log('Settings loaded:', this.settings);
          console.log('Logo Media:', this.settings.logoMedia);
          console.log('Logo Media URL:', this.settings.logoMedia?.url);
          console.log('Has logoMedia?', !!this.settings.logoMedia);
          console.log('Has logoMedia.url?', !!this.settings.logoMedia?.url);
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error loading settings:', error);
      }
    });
  }
}
