import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-static-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="static-section">
      <div class="container">
        <div class="content-grid">
          <div class="text-content">
            <h2 class="section-title">
              DISCOVER<br>
              STYLES<br>
              MATCH<br>
              PERSONALITY
            </h2>
            <p class="section-description">
              Modern interior design and construction solutions tailored to your lifestyle.
            </p>
          </div>
          <div class="image-content">
            <div class="image-wrapper">
              <img src="/yc-assets/pexels-athena-2962066.jpg" alt="Interior Design" />
              <div class="overlay-text">
                <h3>THAT<br>YOUR</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .static-section {
      padding: var(--spacing-xl) 0;
      background-color: var(--color-beige-light);
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .text-content {
      .section-title {
        font-size: 3.5rem;
        line-height: 1.1;
        margin-bottom: 1.5rem;
        color: var(--color-text-dark);
      }
      
      .section-description {
        font-size: 1.1rem;
        color: var(--color-text-light);
        line-height: 1.8;
      }
    }

    .image-wrapper {
      position: relative;
      border-radius: var(--radius-lg);
      overflow: hidden;
      
      img {
        width: 100%;
        height: 500px;
        object-fit: cover;
      }
      
      .overlay-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        
        h3 {
          font-size: 4rem;
          color: var(--color-white);
          text-align: center;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
        }
      }
    }

    @media (max-width: 968px) {
      .content-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .text-content .section-title {
        font-size: 2.5rem;
      }
    }
  `]
})
export class StaticSectionComponent {}
