import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../../shared/services/settings.service';
import { ServiceService } from '../../../shared/services/service.service';
import { ApplicationSettings } from '../../../shared/models/settings.model';
import { Service } from '../../../shared/models/service.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer" id="contact">
      <div class="container">
        <div class="footer-grid">
          <!-- Column 1: Company Info -->
          <div class="footer-col company-info">
            <div class="footer-logo">
              <img 
                *ngIf="settings?.logoMedia?.url" 
                [src]="settings?.logoMedia?.url" 
                [alt]="settings?.siteName || 'Logo'"
              />
            </div>
            <h3 class="company-name">{{ settings?.siteName || 'YC Interior & Builders' }}</h3>
            <p class="company-description">
              {{ settings?.description || 'YC Interior Builders is a trusted name in interior design and construction services, dedicated to transforming spaces with creativity, precision, and professionalism.' }}
            </p>
          </div>
          
          <!-- Column 2: Services -->
          <div class="footer-col services-col">
            <h4 class="footer-title">Our Services</h4>
            <ul class="footer-links">
              <li *ngFor="let service of services">
                <a href="#services">{{ service.title }}</a>
              </li>
            </ul>
          </div>
          
          <!-- Column 3: Contact -->
          <div class="footer-col contact-col">
            <h4 class="footer-title">Contact Us</h4>
            <ul class="footer-contact">
              <li *ngIf="settings?.phone">
                <span class="icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </span>
                <span>{{ settings?.phone }}</span>
              </li>
              <li *ngIf="settings?.email">
                <span class="icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <span>{{ settings?.email }}</span>
              </li>
              <li *ngIf="settings?.address">
                <span class="icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </span>
                <span>{{ settings?.address }}</span>
              </li>
            </ul>
            
            <!-- Social Media Links -->
            <div class="social-media" *ngIf="settings?.instagramUrl || settings?.facebookUrl || settings?.linkedinUrl">
              <a *ngIf="settings?.instagramUrl" [href]="settings?.instagramUrl" target="_blank" rel="noopener noreferrer" class="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a *ngIf="settings?.facebookUrl" [href]="settings?.facebookUrl" target="_blank" rel="noopener noreferrer" class="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a *ngIf="settings?.linkedinUrl" [href]="settings?.linkedinUrl" target="_blank" rel="noopener noreferrer" class="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div class="footer-image">
          <img src="/yc-assets/yy.jpg" alt="Interior Design" />
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      padding: var(--spacing-xl) 0 var(--spacing-md);
      background-color: #CFD0AE;
      position: relative;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1.5fr;
      gap: 3rem;
      margin-bottom: 3rem;
      position: relative;
      z-index: 1;
    }

    .footer-col {
      &.company-info {
        .footer-logo {
          margin-bottom: 1.5rem;
          
          img {
            width: 80px;
            height: 80px;
            object-fit: contain;
            background-color: #4A5D4F;
            border-radius: 50%;
            padding: 0.5rem;
          }
        }
        
        .company-name {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #2C3E2F;
          line-height: 1.2;
        }
        
        .company-description {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #5A6B5C;
          max-width: 400px;
        }
      }
      
      &.services-col {
        .footer-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #2C3E2F;
        }
        
        .footer-links {
          list-style: none;
          
          li {
            margin-bottom: 0.85rem;
            
            a {
              color: #5A6B5C;
              font-size: 0.95rem;
              text-decoration: none;
              transition: color 0.3s;
              
              &:hover {
                color: #4A5D4F;
              }
            }
          }
        }
      }
      
      &.contact-col {
        .footer-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #2C3E2F;
        }
        
        .footer-contact {
          list-style: none;
          margin-bottom: 2rem;
          
          li {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            margin-bottom: 1.2rem;
            font-size: 0.95rem;
            color: #5A6B5C;
            
            .icon {
              flex-shrink: 0;
              width: 24px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #4A5D4F;
              
              svg {
                width: 20px;
                height: 20px;
              }
            }
            
            span:last-child {
              flex: 1;
              line-height: 1.5;
            }
          }
        }
        
        .social-media {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          
          .social-link {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #4A5D4F;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            transition: all 0.3s;
            
            &:hover {
              background-color: #3A4D3F;
              transform: translateY(-3px);
            }
            
            svg {
              width: 20px;
              height: 20px;
            }
          }
        }
      }
    }

    .footer-image {
      position: absolute;
      bottom: 0;
      right: 5%;
      width: 280px;
      height: 280px;
      border-radius: 50%;
      overflow: hidden;
      border: 8px solid white;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    @media (max-width: 1200px) {
      .footer-image {
        width: 220px;
        height: 220px;
        right: 3%;
      }
    }

    @media (max-width: 968px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
        padding-bottom: 150px;
      }
      
      .footer-image {
        right: 50%;
        transform: translateX(50%);
        width: 200px;
        height: 200px;
      }
    }

    @media (max-width: 576px) {
      .footer {
        padding: var(--spacing-lg) 0 var(--spacing-sm);
      }
      
      .footer-grid {
        gap: 2rem;
        padding-bottom: 120px;
      }
      
      .footer-image {
        width: 160px;
        height: 160px;
      }
      
      .footer-col {
        &.company-info {
          .company-name {
            font-size: 1.5rem;
          }
          
          .company-description {
            font-size: 0.9rem;
          }
        }
      }
    }
  `]
})
export class FooterComponent implements OnInit {
  settings: ApplicationSettings | null = null;
  services: Service[] = [];
  environment = environment;

  constructor(
    private settingsService: SettingsService,
    private serviceService: ServiceService
  ) {}

  ngOnInit() {
    this.loadSettings();
    this.loadServices();
  }

  private loadSettings() {
    this.settingsService.getSettings().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.settings = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading settings:', error);
      }
    });
  }

  private loadServices() {
    this.serviceService.getServices(0, 10).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.services = response.data.content;
        }
      },
      error: (error) => {
        console.error('Error loading services:', error);
      }
    });
  }
}
