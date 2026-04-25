import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { ServiceService } from '../shared/services/service.service';
import { Service } from '../shared/models/service.model';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="services-page">
      <div class="container">
        <h1 class="page-title">OUR SERVICES</h1>
        
        <div class="services-grid" *ngIf="!loading && services.length > 0">
          <div class="service-card" *ngFor="let service of services">
            <div class="service-image" [style.background-image]="'url(' + service.coverMedia?.url + ')'">
              <div class="service-overlay">
                <h3 class="service-title">{{ service.title }}</h3>
                <p class="service-description">{{ service.description }}</p>
                <button class="btn-learn-more" (click)="navigateToService(service.id)">Learn More</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="loading-state" *ngIf="loading">
          <p>Loading services...</p>
        </div>
        
        <div class="empty-state" *ngIf="!loading && services.length === 0">
          <p>No services available at the moment.</p>
        </div>
      </div>
    </div>
    
    <app-footer></app-footer>
  `,
  styles: [`
    .services-page {
      background-color: #D4D9C8;
      min-height: 100vh;
      padding: 80px 0;
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

    .page-title {
      font-family: 'Ade', serif;
      font-size: 72px;
      font-weight: 400;
      color: #46563B;
      margin-bottom: 60px;
      letter-spacing: 2px;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
    }

    .service-card {
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      aspect-ratio: 1;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
      }
    }

    .service-image {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
    }

    .service-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(70, 86, 59, 0) 0%, rgba(70, 86, 59, 0) 40%, rgba(70, 86, 59, 0.85) 100%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 40px;
      color: white;
    }

    .service-title {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 16px;
      color: white;
    }

    .service-description {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 24px;
      color: rgba(255, 255, 255, 0.95);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      max-height: 3.2em;
    }

    .btn-learn-more {
      background-color: #46563B;
      color: white;
      padding: 12px 28px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 15px;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      align-self: flex-start;
      
      &:hover {
        background-color: #5a6e4a;
        transform: translateY(-2px);
      }
    }

    .loading-state,
    .empty-state {
      text-align: center;
      padding: 80px 20px;
      font-size: 18px;
      color: #46563B;
    }

    @media (max-width: 1024px) {
      .container {
        padding: 0 40px;
      }

      .services-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
      }

      .page-title {
        font-size: 56px;
      }
    }

    @media (max-width: 768px) {
      .services-page {
        padding: 40px 0;
      }

      .container {
        padding: 0 20px;
      }

      .services-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .page-title {
        font-size: 36px;
        margin-bottom: 40px;
      }

      .service-overlay {
        padding: 24px;
      }

      .service-title {
        font-size: 22px;
        margin-bottom: 12px;
      }

      .service-description {
        font-size: 14px;
        margin-bottom: 20px;
      }
      
      .btn-learn-more {
        padding: 10px 24px;
        font-size: 14px;
      }
    }
  `]
})
export class ServicesPageComponent implements OnInit {
  services: Service[] = [];
  loading = true;

  constructor(
    private serviceService: ServiceService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'auto' });
    this.loadServices();
  }

  navigateToService(serviceId: number) {
    this.router.navigate(['/services', serviceId]);
  }

  loadServices() {
    this.loading = true;
    // Load all services (not just featured)
    this.serviceService.getServices(0, 100).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.services = response.data.content;
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
}
