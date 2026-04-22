import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpactService } from '../../../shared/services/impact.service';
import { ImpactStatistics } from '../../../shared/models/impact.model';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-image">
              <img src="/yc-assets/pexels-thisispav-34571964.jpg" alt="Running Projects" />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats?.projectsCompleted || '09' }}</h3>
              <p class="stat-label">running<br>projects</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-image">
              <img src="/yc-assets/download (37).jpg" alt="Complete Projects" />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats?.happyClients || '320' }}</h3>
              <p class="stat-label">complete<br>projects</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-image">
              <img src="/yc-assets/download (38).jpg" alt="Success Rate" />
            </div>
            <div class="stat-content">
              <h3 class="stat-number">91%</h3>
              <p class="stat-label">success<br>rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .stats-section {
      padding: var(--spacing-xl) 0;
      background: linear-gradient(135deg, var(--color-sage) 0%, var(--color-beige-light) 50%, var(--color-cream) 100%);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .stat-card {
      position: relative;
      height: 400px;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      
      .stat-image {
        position: absolute;
        inset: 0;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        &::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6));
        }
      }
      
      .stat-content {
        position: relative;
        z-index: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 2rem;
        color: var(--color-white);
        
        .stat-number {
          font-size: 4rem;
          font-weight: 300;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          font-size: 1.1rem;
          text-transform: lowercase;
          line-height: 1.4;
        }
      }
    }

    @media (max-width: 968px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StatsComponent implements OnInit {
  stats: ImpactStatistics | null = null;

  constructor(private impactService: ImpactService) {}

  ngOnInit() {
    this.impactService.getStatistics().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }
}
