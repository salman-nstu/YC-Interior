import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../../shared/services/settings.service';
import { ApplicationSettings } from '../../../shared/models/settings.model';
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
          <div class="footer-col">
            <div class="footer-logo">
              <img 
                *ngIf="settings?.logoUrl" 
                [src]="environment.fileBaseUrl + (settings?.logoUrl || '')" 
                [alt]="settings?.companyName || 'Logo'"
              />
              <span class="logo-text">{{ settings?.companyName || 'YC Interior' }}</span>
            </div>
            <h3 class="company-name">{{ settings?.companyName || 'YC Interior & Builders' }}</h3>
            <p class="company-description">
              {{ settings?.description || 'YC Interior Builders is a trusted name in interior design and construction services, dedicated to transforming spaces with creativity, precision, and professionalism.' }}
            </p>
          </div>
          
          <!-- Column 2: Services -->
          <div class="footer-col">
            <h4 class="footer-title">Our Services</h4>
            <ul class="footer-links">
              <li><a href="#services">Interior Plan</a></li>
              <li><a href="#services">AutoCAD 2D, 3D design</a></li>
              <li><a href="#services">Estimate</a></li>
              <li><a href="#services">Soil Service</a></li>
              <li><a href="#services">Building Plan</a></li>
            </ul>
          </div>
          
          <!-- Column 3: Contact -->
          <div class="footer-col">
            <h4 class="footer-title">Contact Us</h4>
            <ul class="footer-contact">
              <li>
                <span class="icon">📧</span>
                <span>{{ settings?.email || 'info@ycinterior.com' }}</span>
              </li>
              <li>
                <span class="icon">📞</span>
                <span>{{ settings?.phone || '+1234567890' }}</span>
              </li>
              <li>
                <span class="icon">📍</span>
                <span>{{ settings?.address || 'Your Address Here' }}</span>
              </li>
              <li>
                <span class="icon">👤</span>
                <span>Social Media</span>
              </li>
            </ul>
            
            <div class="newsletter">
              <h4 class="footer-title">Get The Latest Trending News</h4>
              <div class="newsletter-form">
                <input type="email" placeholder="Enter Your Email" />
              </div>
            </div>
          </div>
        </div>
        
        <div class="footer-image">
          <img src="/yc-assets/pexels-athena-2962066.jpg" alt="Interior Design" />
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      padding: var(--spacing-xl) 0 var(--spacing-md);
      background-color: var(--color-beige-light);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1.5fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }

    .footer-col {
      .footer-logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
        
        img {
          width: 50px;
          height: 50px;
          object-fit: contain;
        }
        
        .logo-text {
          font-family: var(--font-title);
          font-size: 1.5rem;
          color: var(--color-primary-dark);
        }
      }
      
      .company-name {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: var(--color-text-dark);
      }
      
      .company-description {
        font-size: 0.9rem;
        line-height: 1.6;
        color: var(--color-text-light);
      }
      
      .footer-title {
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
        color: var(--color-text-dark);
      }
      
      .footer-links {
        list-style: none;
        
        li {
          margin-bottom: 0.75rem;
          
          a {
            color: var(--color-text-light);
            font-size: 0.9rem;
            transition: color 0.3s;
            
            &:hover {
              color: var(--color-primary);
            }
          }
        }
      }
      
      .footer-contact {
        list-style: none;
        margin-bottom: 2rem;
        
        li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: var(--color-text-light);
          
          .icon {
            font-size: 1.2rem;
          }
        }
      }
      
      .newsletter {
        .newsletter-form {
          margin-top: 1rem;
          
          input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid var(--color-text-light);
            border-radius: var(--radius-sm);
            font-family: var(--font-body);
            font-size: 0.9rem;
            
            &:focus {
              outline: none;
              border-color: var(--color-primary);
            }
          }
        }
      }
    }

    .footer-image {
      width: 200px;
      height: 200px;
      margin: 0 auto;
      border-radius: 50%;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    @media (max-width: 968px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }
  `]
})
export class FooterComponent implements OnInit {
  settings: ApplicationSettings | null = null;
  environment = environment;

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
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
}
