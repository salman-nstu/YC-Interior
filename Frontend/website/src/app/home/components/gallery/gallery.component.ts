import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryService } from '../../../shared/services/gallery.service';
import { GalleryImage } from '../../../shared/models/gallery.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="gallery-section">
      <div class="container">
        <div class="gallery-header">
          <div class="gallery-title-box">
            <h2 class="section-title">PHOTO<br>GALLERY</h2>
          </div>
        </div>
        
        <div class="gallery-grid" *ngIf="images.length > 0">
          <div class="gallery-item" *ngFor="let image of images.slice(0, 7); let i = index" [class]="'item-' + (i + 1)">
            <img 
              [src]="image.imageUrl ? environment.fileBaseUrl + image.imageUrl : getPlaceholderImage(i)" 
              [alt]="image.caption || 'Gallery Image'"
            />
          </div>
        </div>
        
        <div class="gallery-description">
          <p>A glimpse into the spaces we designed and brought to life.</p>
          <button class="btn-primary">explore →</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .gallery-section {
      padding: var(--spacing-xl) 0;
      background-color: var(--color-sage);
    }

    .gallery-header {
      margin-bottom: 3rem;
    }

    .gallery-title-box {
      background-color: var(--color-primary-dark);
      color: var(--color-white);
      padding: 2rem 3rem;
      display: inline-block;
      border-radius: var(--radius-md);
      
      .section-title {
        font-size: 3rem;
        line-height: 1.2;
        margin: 0;
      }
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(3, 250px);
      gap: 1rem;
      margin-bottom: 3rem;
      
      .gallery-item {
        overflow: hidden;
        border-radius: var(--radius-md);
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        &:hover img {
          transform: scale(1.1);
        }
      }
      
      .item-1 {
        grid-column: 1 / 3;
        grid-row: 1 / 2;
      }
      
      .item-2 {
        grid-column: 3 / 4;
        grid-row: 1 / 3;
      }
      
      .item-3 {
        grid-column: 4 / 5;
        grid-row: 1 / 2;
      }
      
      .item-4 {
        grid-column: 1 / 2;
        grid-row: 2 / 3;
      }
      
      .item-5 {
        grid-column: 2 / 3;
        grid-row: 2 / 3;
      }
      
      .item-6 {
        grid-column: 4 / 5;
        grid-row: 2 / 4;
      }
      
      .item-7 {
        grid-column: 1 / 4;
        grid-row: 3 / 4;
      }
    }

    .gallery-description {
      text-align: center;
      
      p {
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
        color: var(--color-text-dark);
      }
    }

    @media (max-width: 968px) {
      .gallery-grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        
        .gallery-item {
          grid-column: 1 !important;
          grid-row: auto !important;
          height: 250px;
        }
      }
    }
  `]
})
export class GalleryComponent implements OnInit {
  images: GalleryImage[] = [];
  loading = false;
  environment = environment;

  constructor(private galleryService: GalleryService) {}

  ngOnInit() {
    this.loading = true;
    this.galleryService.getFeaturedImages().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.images = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading gallery:', error);
        this.loading = false;
      }
    });
  }

  getPlaceholderImage(index: number): string {
    const placeholders = [
      '/yc-assets/pexels-athena-2962066.jpg',
      '/yc-assets/pexels-iremonat-14564071.jpg',
      '/yc-assets/pexels-skylake-18764911.jpg',
      '/yc-assets/don-kaveen-NFbwes_e-jI-unsplash.jpg',
      '/yc-assets/jason-briscoe-AQl-J19ocWE-unsplash.jpg',
      '/yc-assets/jason-briscoe-UV81E0oXXWQ-unsplash.jpg',
      '/yc-assets/pexels-thisispav-34571964.jpg'
    ];
    return placeholders[index % placeholders.length];
  }
}
