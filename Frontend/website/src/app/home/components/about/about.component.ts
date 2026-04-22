import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutService } from '../../../shared/services/about.service';
import { AboutUs } from '../../../shared/models/about.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="about-section" id="about">
      <div class="container">
        <div class="about-grid">
          <div class="about-image">
            <img src="/yc-assets/pexels-iremonat-14564071.jpg" alt="About Us" />
          </div>
          <div class="about-content">
            <h2 class="section-title">ABOUT US</h2>
            <div class="about-text" *ngIf="about">
              <p>{{ about.content }}</p>
            </div>
            <div class="about-text" *ngIf="!about && !loading">
              <p>
                YC Interior Builders is a trusted name in interior design and construction services, 
                dedicated to transforming spaces with creativity, precision, and professionalism.
              </p>
            </div>
            <button class="btn-learn-more">learn more →</button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-section {
      padding: var(--spacing-xl) 0;
      background-color: var(--color-cream);
    }

    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .about-image {
      img {
        width: 100%;
        height: 600px;
        object-fit: cover;
        border-radius: var(--radius-lg);
      }
    }

    .about-content {
      .section-title {
        font-size: 3.5rem;
        margin-bottom: 2rem;
        color: var(--color-text-dark);
      }
      
      .about-text {
        background-color: rgba(45, 106, 79, 0.1);
        padding: 2rem;
        border-radius: var(--radius-md);
        margin-bottom: 2rem;
        
        p {
          font-size: 1rem;
          line-height: 1.8;
          color: var(--color-text-dark);
        }
      }
      
      .btn-learn-more {
        background-color: var(--color-primary-dark);
        color: var(--color-white);
        padding: 0.75rem 2rem;
        border-radius: var(--radius-sm);
        font-weight: 500;
        transition: all 0.3s ease;
        
        &:hover {
          background-color: var(--color-primary);
          transform: translateY(-2px);
        }
      }
    }

    @media (max-width: 968px) {
      .about-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .about-image img {
        height: 400px;
      }
      
      .about-content .section-title {
        font-size: 2.5rem;
      }
    }
  `]
})
export class AboutComponent implements OnInit {
  about: AboutUs | null = null;
  loading = false;

  constructor(private aboutService: AboutService) {}

  ngOnInit() {
    this.loading = true;
    this.aboutService.getAbout().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.about = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading about:', error);
        this.loading = false;
      }
    });
  }
}
