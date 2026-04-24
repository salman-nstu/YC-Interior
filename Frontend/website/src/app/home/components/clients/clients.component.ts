import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../shared/services/client.service';
import { Client } from '../../../shared/models/client.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="clients-section">
      <div class="clients-overlay"></div>
      <div class="clients-container">
        <!-- Title on Left -->
        <div class="clients-title">
          <h2 class="section-title">
            YOU<br>
            TRUSTED,<br>
            WE<br>
            DELIVERED.
          </h2>
        </div>
        
        <!-- Client Logos at Bottom -->
        <div class="clients-logos-wrapper">
          <!-- Loading State -->
          <div class="loading-state" *ngIf="loading">
            <div class="skeleton-logo" *ngFor="let i of [1,2,3,4,5]">
              <div class="skeleton-shimmer"></div>
            </div>
          </div>
          
          <!-- Client Logos Row -->
          <div class="clients-logos" *ngIf="!loading && clients.length > 0">
            <div class="client-card" *ngFor="let client of clients; trackBy: trackById">
              <img 
                [src]="getClientLogo(client)" 
                [alt]="client.name"
                [title]="client.name"
                (error)="onImageError($event)"
              />
            </div>
          </div>
          
          <!-- Empty State -->
          <div class="empty-state" *ngIf="!loading && clients.length === 0">
            <p>No clients to display at the moment.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .clients-section {
      background-image: url('/yc-assets/uu.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      padding: 80px 60px 60px;
      position: relative;
      min-height: 600px;
      width: 100%;
      display: flex;
      flex-direction: column;
    }

    .clients-overlay {
      position: absolute;
      inset: 0;
      background: rgba(20, 15, 10, 0.5);
      z-index: 1;
    }

    .clients-container {
      position: relative;
      z-index: 2;
      max-width: 1440px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 500px;
    }

    /* Title on Left Side */
    .clients-title {
      align-self: flex-start;
      margin-bottom: auto;
      
      .section-title {
        font-family: 'Ade Display', 'Georgia', serif;
        font-weight: 400;
        font-style: normal;
        font-size: 64px;
        line-height: 100%;
        letter-spacing: 0%;
        color: #ffffff;
        margin: 0;
        text-transform: uppercase;
      }
    }

    /* Client Logos at Bottom */
    .clients-logos-wrapper {
      margin-top: auto;
      width: 100%;
    }

    /* Loading State */
    .loading-state {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .skeleton-logo {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 12px;
      width: 180px;
      height: 100px;
      position: relative;
      overflow: hidden;
    }

    .skeleton-shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.5) 50%,
        transparent 100%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Client Logos Row */
    .clients-logos {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
      align-items: center;
    }

    .client-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 25px 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 180px;
      height: 100px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
      }
      
      img {
        max-width: 140px;
        max-height: 70px;
        width: auto;
        height: auto;
        object-fit: contain;
        display: block;
      }
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      
      p {
        font-family: 'Sofia Sans', sans-serif;
        font-size: 18px;
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
      }
    }

    /* Responsive Design */
    @media (max-width: 1440px) {
      .clients-section {
        padding: 70px 40px 50px;
      }

      .clients-title .section-title {
        font-size: 56px;
      }

      .client-card {
        min-width: 160px;
        height: 90px;
        padding: 20px 25px;
        
        img {
          max-width: 120px;
          max-height: 60px;
        }
      }
    }

    @media (max-width: 1024px) {
      .clients-section {
        padding: 60px 30px 40px;
        min-height: 500px;
      }

      .clients-title .section-title {
        font-size: 48px;
      }

      .clients-logos {
        gap: 16px;
      }

      .client-card {
        min-width: 140px;
        height: 80px;
        padding: 18px 20px;
        
        img {
          max-width: 100px;
          max-height: 50px;
        }
      }
    }

    @media (max-width: 768px) {
      .clients-section {
        padding: 50px 20px 30px;
        min-height: 450px;
      }

      .clients-container {
        min-height: 400px;
      }

      .clients-title .section-title {
        font-size: 40px;
      }

      .clients-logos {
        gap: 12px;
      }

      .client-card {
        min-width: 120px;
        height: 70px;
        padding: 15px 18px;
        
        img {
          max-width: 90px;
          max-height: 45px;
        }
      }
    }

    @media (max-width: 480px) {
      .clients-section {
        padding: 40px 15px 25px;
        min-height: 400px;
      }

      .clients-container {
        min-height: 350px;
      }

      .clients-title .section-title {
        font-size: 32px;
      }

      .clients-logos {
        gap: 10px;
        justify-content: center;
      }

      .client-card {
        min-width: 100px;
        height: 60px;
        padding: 12px 15px;
        
        img {
          max-width: 70px;
          max-height: 35px;
        }
      }
    }
  `]
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  loading = true;

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.loading = true;
    this.clientService.getAllClients().subscribe({
      next: (response) => {
        console.log('Clients API Response:', response);
        if (response.success && response.data) {
          // Check if data is an array or has content property (paginated)
          const clientData = Array.isArray(response.data) 
            ? response.data 
            : (response.data as any).content || [];
          
          console.log('Client Data:', clientData);
          
          // Sort by displayOrder
          this.clients = clientData.sort((a: Client, b: Client) => 
            (a.displayOrder || 0) - (b.displayOrder || 0)
          );
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.loading = false;
      }
    });
  }

  getClientLogo(client: Client): string {
    // Check if logoMedia exists and has url
    if (client.logoMedia && client.logoMedia.url) {
      const logoUrl = client.logoMedia.url;
      console.log('Logo URL for', client.name, ':', logoUrl);
      return logoUrl;
    }
    
    console.log('No logo media for client:', client.name, client);
    // Fallback placeholder
    return '/yc-assets/placeholder-logo.png';
  }

  onImageError(event: any) {
    console.error('Image failed to load:', event.target.src);
    event.target.src = '/yc-assets/placeholder-logo.png';
  }

  trackById(index: number, item: Client): number {
    return item.id;
  }
}
