import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { ServiceService } from '../shared/services/service.service';
import { Service } from '../shared/models/service.model';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="service-detail-page">
      <div class="container">
        <div *ngIf="!loading && service" class="service-content">
          <h1 class="service-title">{{ service.title }}</h1>
          <div class="title-underline"></div>
          
          <div class="service-image-wrapper">
            <img [src]="service.coverMedia?.url" [alt]="service.title" class="service-image" />
          </div>
          
          <div class="service-description">
            <p>{{ service.description }}</p>
          </div>
        </div>
        
        <div class="loading-state" *ngIf="loading">
          <p>Loading service details...</p>
        </div>
        
        <div class="error-state" *ngIf="!loading && !service">
          <p>Service not found.</p>
        </div>
      </div>
    </div>
    
    <app-footer></app-footer>
  `,
  styles: [`
    .service-detail-page {
      background-color: #D4D9C8;
      min-height: 100vh;
      padding: 80px 0;
      width: 100%;
      overflow-x: hidden;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 60px;
      width: 100%;
      box-sizing: border-box;
    }

    .service-content {
      display: flex;
      flex-direction: column;
      gap: 40px;
    }

    .service-title {
      font-family: 'Ade', serif;
      font-size: 64px;
      font-weight: 400;
      color: #46563B;
      text-align: center;
      margin: 0;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .title-underline {
      width: 100%;
      height: 2px;
      background-color: #46563B;
      margin: 0 auto;
    }

    .service-image-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      margin: 20px 0;
    }

    .service-image {
      width: 100%;
      max-width: 900px;
      height: auto;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      object-fit: cover;
    }

    .service-description {
      max-width: 900px;
      margin: 0 auto;
      
      p {
        font-family: 'Sofia Sans', sans-serif;
        font-size: 18px;
        line-height: 1.8;
        color: #2d2d2d;
        text-align: justify;
        margin: 0;
        white-space: pre-wrap;
      }
    }

    .loading-state,
    .error-state {
      text-align: center;
      padding: 80px 20px;
      font-size: 18px;
      color: #46563B;
    }

    @media (max-width: 1024px) {
      .container {
        padding: 0 40px;
      }

      .service-title {
        font-size: 48px;
      }

      .service-description p {
        font-size: 16px;
      }
    }

    @media (max-width: 768px) {
      .service-detail-page {
        padding: 60px 0;
      }

      .container {
        padding: 0 20px;
      }

      .service-content {
        gap: 30px;
      }

      .service-title {
        font-size: 36px;
      }

      .service-description p {
        font-size: 15px;
      }
    }
  `]
})
export class ServiceDetailComponent implements OnInit {
  service: Service | null = null;
  loading = true;
  serviceId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    // Get service ID from route params
    this.route.params.subscribe(params => {
      this.serviceId = +params['id'];
      if (this.serviceId) {
        this.loadService();
      }
    });
  }

  loadService() {
    this.loading = true;
    this.serviceService.getServiceById(this.serviceId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.service = response.data;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading service:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
