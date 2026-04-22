import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../../shared/services/service.service';
import { Service } from '../../../shared/models/service.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="services-section" id="services">
      <div class="container">
        <h2 class="section-title">OUR SERVICES</h2>
        
        <div class="services-grid" *ngIf="services.length > 0">
          <div class="service-card" *ngFor="let service of services.slice(0, 6)">
            <div class="service-image">
              <img 
                [src]="service.coverImageUrl ? environment.fileBaseUrl + service.coverImageUrl : '/yc-assets/pexels-skylake-18764911.jpg'" 
                [alt]="service.title"
              />
            </div>
            <h3 class="service-title">{{ service.title }}</h3>
          </div>
        </div>
        
        <div class="empty-state" *ngIf="services.length === 0 && !loading">
          <p>No services available at the moment.</p>
        </div>
        
        <div class="view-all-btn">
          <button class="btn-primary">view all →</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .services-section {
      padding: var(--spacing-xl) 0;
      background: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)),
                  url('/yc-assets/alberto-castillo-q-mx4mSkK9zeo-unsplash.jpg') center/cover fixed;
    }

    .section-title {
      text-align: center;
      font-size: 3rem;
      margin-bottom: 3rem;
      color: var(--color-primary-dark);
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .service-card {
      background: var(--color-white);
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-lg);
      }
      
      .service-image {
        height: 250px;
        overflow: hidden;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
      }
      
      &:hover .service-image img {
        transform: scale(1.1);
      }
      
      .service-title {
        padding: 1.5rem;
        text-align: center;
        font-size: 1.1rem;
        color: var(--color-text-dark);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--color-text-light);
    }

    .view-all-btn {
      text-align: center;
      margin-top: 2rem;
    }

    @media (max-width: 768px) {
      .services-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  loading = false;
  environment = environment;

  constructor(private serviceService: ServiceService) {}

  ngOnInit() {
    this.loading = true;
    this.serviceService.getFeaturedServices().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.services = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.loading = false;
      }
    });
  }
}
