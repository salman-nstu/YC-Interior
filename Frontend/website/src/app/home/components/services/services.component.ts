import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServiceService } from '../../../shared/services/service.service';
import { Service } from '../../../shared/models/service.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="services-section" id="services" [style.background-image]="'url(/yc-assets/download8.jpg)'">
      <div class="container">
        <h2 class="section-title">OUR SERVICES</h2>
        
        <div class="services-grid" *ngIf="!loading && services.length > 0">
          <div class="service-card" *ngFor="let service of services" (click)="navigateToService(service.id)">
            <div class="service-image">
              <img 
                [src]="getServiceImage(service)" 
                [alt]="service.title"
              />
            </div>
            <h3 class="service-title">{{ service.title }}</h3>
          </div>
        </div>
        
        <div class="loading-state" *ngIf="loading">
          <p>Loading services...</p>
        </div>
        
        <div class="empty-state" *ngIf="!loading && services.length === 0">
          <p>No services available at the moment.</p>
        </div>
        
        <div class="view-all-btn">
          <button class="btn-primary" (click)="navigateToServices()">view all →</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .services-section {
      padding: 100px 0;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
      min-height: 650px;
      overflow: hidden;
    }

    .container {
      position: relative;
      z-index: 2;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 40px;
    }

    .section-title {
      text-align: center;
      font-family: 'Playfair Display', serif;
      font-size: 3.5rem;
      margin-bottom: 60px;
      color: #2d6a4f;
      font-weight: 400;
      letter-spacing: 0.02em;
    }

    .services-grid {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: 15px;
      margin-bottom: 50px;
      flex-wrap: nowrap;
    }

    .service-card {
      background: #E8E6DA;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
      flex-shrink: 0;
      width: 190px;
      height: 280px;
      display: flex;
      flex-direction: column;
      padding: 8px;
    }

    .service-card:nth-child(1) {
      transform: translateY(-20px);
    }

    .service-card:nth-child(2) {
      transform: translateY(40px);
    }

    .service-card:nth-child(3) {
      transform: translateY(-20px);
    }

    .service-card:nth-child(4) {
      transform: translateY(40px);
    }

    .service-card:nth-child(5) {
      transform: translateY(-20px);
    }

    .service-card:nth-child(6) {
      transform: translateY(40px);
    }
    
    .service-card:hover {
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
      z-index: 10;
    }
    
    .service-image {
      width: 174px;
      height: 174px;
      overflow: hidden;
      background: #f5f5f5;
      border-radius: 4px;
      margin-bottom: auto;
    }
    
    .service-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .service-card:hover .service-image img {
      transform: scale(1.05);
    }
    
    .service-title {
      padding: 12px 8px;
      text-align: center;
      font-size: 0.75rem;
      color: #144F3C;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
      margin: 0;
      line-height: 1.3;
    }

    .loading-state,
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
      font-size: 1.1rem;
    }

    .view-all-btn {
      text-align: center;
      margin-top: 100px;
    }

    .btn-primary {
      background-color: #2d6a4f;
      color: #ffffff;
      padding: 14px 40px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      text-transform: lowercase;
    }

    .btn-primary:hover {
      background-color: #1f4d38;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(45, 106, 79, 0.3);
    }

    @media (max-width: 1200px) {
      .service-card {
        width: 160px;
        height: 250px;
      }

      .service-image {
        width: 144px;
        height: 144px;
      }

      .services-grid {
        gap: 12px;
      }
    }

    @media (max-width: 768px) {
      .services-section {
        padding: 60px 0;
      }

      .container {
        padding: 0 20px;
      }

      .section-title {
        font-size: 2.5rem;
        margin-bottom: 40px;
      }

      .services-grid {
        flex-wrap: wrap;
        justify-content: center;
        gap: 15px;
      }

      .service-card {
        width: 140px;
        height: 220px;
      }

      .service-card:nth-child(n) {
        transform: translateY(0) !important;
      }

      .service-image {
        width: 124px;
        height: 124px;
      }

      .service-title {
        font-size: 0.7rem;
        padding: 10px 6px;
      }
    }
  `]
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  loading = true;
  environment = environment;

  constructor(
    private serviceService: ServiceService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadServices();
  }

  navigateToServices() {
    this.router.navigate(['/services']);
  }

  navigateToService(serviceId: number) {
    this.router.navigate(['/services', serviceId]);
  }

  loadServices() {
    this.loading = true;
    console.log('Loading services...');
    
    this.serviceService.getServices(0, 6).subscribe({
      next: (response) => {
        console.log('Services API Response:', response);
        if (response.success && response.data && response.data.content) {
          // Filter only published and active services, sorted by displayOrder (0-5)
          this.services = response.data.content
            .filter(s => s.status === 'published' && s.isActive && s.displayOrder >= 0 && s.displayOrder <= 5)
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .slice(0, 6);
          console.log('Services loaded:', this.services);
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getServiceImage(service: Service): string {
    if (service.coverMedia && service.coverMedia.url) {
      return service.coverMedia.url;
    }
    return '/yc-assets/download8.jpg';
  }
}
