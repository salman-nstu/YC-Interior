import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SettingsService } from '../../services/settings.service';
import { ServiceService } from '../../services/service.service';
import { AboutService } from '../../services/about.service';
import { ApplicationSettings } from '../../models/settings.model';
import { Service } from '../../models/service.model';
import { AboutSection } from '../../models/about.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
            <h3 class="company-name">{{ settings?.siteName || 'YC INTERIOR & BUILDERS' }}</h3>
            <p class="company-description">
              {{ aboutDescription || 'YC Interior Builders is a trusted name in interior design and construction services, dedicated to transforming spaces with creativity, precision, and professionalism.' }}
            </p>
          </div>
          
          <!-- Column 2: Services -->
          <div class="footer-col services-col">
            <h4 class="footer-title clickable" (click)="navigateToServices()">Our Services</h4>
            <ul class="footer-links">
              <li *ngFor="let service of services">
                <a (click)="navigateToService(service.id)">{{ service.title }}</a>
              </li>
            </ul>
          </div>
          
          <!-- Column 3: Contact -->
          <div class="footer-col contact-col">
            <h4 class="footer-title clickable" (click)="navigateToContact()">Contact Us</h4>
            <div class="contact-info-wrapper" *ngIf="settings">
              <div class="contact-group" *ngIf="getEmails().length > 0">
                <div class="icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div class="contact-items">
                  <div *ngFor="let email of getEmails()" class="contact-item">{{ email }}</div>
                </div>
              </div>
              
              <div class="contact-group" *ngIf="getPhones().length > 0">
                <div class="icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div class="contact-items">
                  <div *ngFor="let phone of getPhones()" class="contact-item">{{ phone }}</div>
                </div>
              </div>
              
              <div class="contact-group" *ngIf="settings.address">
                <div class="icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div class="contact-items">
                  <div class="contact-item">{{ settings.address }}</div>
                </div>
              </div>
            </div>
            
            <h5 class="social-title">Follow Us</h5>
            <div class="social-media" *ngIf="settings">
              <div *ngIf="settings.facebookUrl" (click)="openExternalLink(settings.facebookUrl, $event)" class="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </div>
              <div *ngIf="settings.instagramUrl" (click)="openExternalLink(settings.instagramUrl, $event)" class="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div *ngIf="settings.linkedinUrl" (click)="openExternalLink(settings.linkedinUrl, $event)" class="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <div *ngIf="settings.whatsappUrl" (click)="openExternalLink(settings.whatsappUrl, $event)" class="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </div>
              <div *ngIf="settings.youtubeUrl" (click)="openExternalLink(settings.youtubeUrl, $event)" class="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </div>
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
      width: 100%;
      overflow-x: hidden;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 60px;
      width: 100%;
      box-sizing: border-box;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1.2fr;
      gap: 3rem;
      margin-bottom: 3rem;
      position: relative;
      z-index: 1;
      padding-right: 320px;
      width: 100%;
      box-sizing: border-box;
    }

    .footer-col {
      &.company-info {
        .footer-logo {
          margin-bottom: 1.5rem;
          
          img {
            width: 80px;
            height: 80px;
            object-fit: contain;
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
          
          &.clickable {
            cursor: pointer;
            transition: color 0.3s ease;
            
            &:hover {
              color: #46563B;
            }
          }
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
              cursor: pointer;
              
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
          
          &.clickable {
            cursor: pointer;
            transition: color 0.3s ease;
            
            &:hover {
              color: #46563B;
            }
          }
        }
        
        .social-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          margin-top: 1.5rem;
          color: #2C3E2F;
        }
        
        .contact-info-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        
        .contact-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          
          .icon-wrapper {
            flex-shrink: 0;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #4A5D4F;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            
            svg {
              width: 24px;
              height: 24px;
            }
          }
          
          .contact-items {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            
            .contact-item {
              font-size: 0.95rem;
              line-height: 1.5;
              color: #5A6B5C;
            }
          }
        }
        
        .social-media {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          
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
            cursor: pointer;
            
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
      right: 2%;
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
      .footer-grid {
        padding-right: 250px;
      }
      
      .footer-image {
        width: 220px;
        height: 220px;
        right: 3%;
      }
    }

    @media (max-width: 968px) {
      .container {
        padding: 0 40px;
      }
      
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
        padding-bottom: 150px;
        padding-right: 0;
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
      
      .container {
        padding: 0 20px;
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
  aboutDescription: string = '';

  constructor(
    private settingsService: SettingsService,
    private serviceService: ServiceService,
    private aboutService: AboutService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadSettings();
    this.loadServices();
    this.loadAboutDescription();
  }

  navigateToServices() {
    this.router.navigate(['/services']).then(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }

  navigateToService(serviceId: number) {
    this.router.navigate(['/services', serviceId]).then(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }

  navigateToContact() {
    this.router.navigate(['/contact']).then(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }

  openExternalLink(url: string, event: Event) {
    console.log('openExternalLink called with URL:', url);
    event.preventDefault();
    event.stopPropagation();
    if (url) {
      // Add protocol if missing
      let finalUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        finalUrl = 'https://' + url;
      }
      console.log('Opening URL in new window:', finalUrl);
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    }
  }

  getEmails(): string[] {
    if (!this.settings?.email) return [];
    return this.settings.email
      .split(/[,;\n]+/)
      .map(e => e.trim())
      .filter(e => e.length > 0);
  }

  getPhones(): string[] {
    if (!this.settings?.phone) return [];
    return this.settings.phone
      .split(/[,;\n]+/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
  }

  private loadSettings() {
    this.settingsService.getSettings().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.settings = response.data;
          this.cdr.detectChanges();
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
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error loading services:', error);
      }
    });
  }

  private loadAboutDescription() {
    this.aboutService.getAboutSections(0, 1).subscribe({
      next: (response) => {
        if (response.success && response.data && response.data.content && response.data.content.length > 0) {
          this.aboutDescription = response.data.content[0].description;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error loading about description:', error);
      }
    });
  }
}