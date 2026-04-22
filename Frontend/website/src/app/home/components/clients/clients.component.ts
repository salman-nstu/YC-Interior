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
      <div class="container">
        <h2 class="section-title">YOU<br>TRUSTED,<br>WE<br>DELIVERED.</h2>
        
        <div class="clients-carousel" *ngIf="clients.length > 0">
          <div class="carousel-track">
            <div class="client-logo" *ngFor="let client of displayClients">
              <img 
                [src]="client.logoUrl ? environment.fileBaseUrl + client.logoUrl : '/yc-assets/uu.jpg'" 
                [alt]="client.name"
              />
            </div>
          </div>
        </div>
        
        <div class="empty-state" *ngIf="clients.length === 0 && !loading">
          <p>No clients to display at the moment.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .clients-section {
      padding: var(--spacing-xl) 0;
      background: url('/yc-assets/uuu.jpg') center/cover;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(101, 67, 33, 0.85);
      }
    }

    .container {
      position: relative;
      z-index: 1;
    }

    .section-title {
      font-size: 3.5rem;
      color: var(--color-white);
      margin-bottom: 3rem;
      line-height: 1.2;
    }

    .clients-carousel {
      overflow: hidden;
      padding: 2rem 0;
    }

    .carousel-track {
      display: flex;
      gap: 3rem;
      animation: scroll 30s linear infinite;
      
      &:hover {
        animation-play-state: paused;
      }
    }

    .client-logo {
      flex-shrink: 0;
      width: 200px;
      height: 100px;
      background: var(--color-white);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      
      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        filter: grayscale(100%);
        transition: filter 0.3s ease;
      }
      
      &:hover img {
        filter: grayscale(0%);
      }
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--color-white);
    }

    @keyframes scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    @media (max-width: 768px) {
      .section-title {
        font-size: 2.5rem;
      }
    }
  `]
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  displayClients: Client[] = [];
  loading = false;
  environment = environment;

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.loading = true;
    this.clientService.getAllClients().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.clients = response.data;
          // Duplicate clients for infinite scroll effect
          this.displayClients = [...this.clients, ...this.clients];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.loading = false;
      }
    });
  }
}
