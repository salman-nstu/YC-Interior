import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryService } from '../../../shared/services/gallery.service';
import { GalleryImage } from '../../../shared/models/gallery.model';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="gallery-section">
      <!-- Gallery Container -->
      <div class="gallery-container">
        <!-- Skeleton Loading -->
        <div class="skeleton-grid" *ngIf="loading">
          <div class="skeleton" *ngFor="let i of [1,2,3,4,5,6,7]"></div>
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-cta"></div>
        </div>

        <!-- Gallery Grid -->
        <div class="gallery-grid" *ngIf="!loading && images.length > 0">
          <!-- Image 1: Top Left Large -->
          <div class="gallery-item item-1" 
               [ngClass]="getAspectRatioClass(images[0])"
               #parallaxItem1
               (mousemove)="onMouseMove($event, parallaxItem1)"
               (mouseleave)="onMouseLeave(parallaxItem1)"
               *ngIf="images[0]">
            <div class="img-wrapper">
              <img 
                [src]="getImageUrl(images[0])" 
                [alt]="images[0].media?.altText || images[0].title || 'Gallery Image 1'"
                (load)="onImageLoad($event, images[0])"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <!-- Image 2: Top Center Tall -->
          <div class="gallery-item item-2" 
               [ngClass]="getAspectRatioClass(images[1])"
               #parallaxItem2
               (mousemove)="onMouseMove($event, parallaxItem2)"
               (mouseleave)="onMouseLeave(parallaxItem2)"
               *ngIf="images[1]">
            <div class="img-wrapper">
              <img 
                [src]="getImageUrl(images[1])" 
                [alt]="images[1].media?.altText || images[1].title || 'Gallery Image 2'"
                (load)="onImageLoad($event, images[1])"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <!-- Image 3: Top Right -->
          <div class="gallery-item item-3" 
               [ngClass]="getAspectRatioClass(images[2])"
               #parallaxItem3
               (mousemove)="onMouseMove($event, parallaxItem3)"
               (mouseleave)="onMouseLeave(parallaxItem3)"
               *ngIf="images[2]">
            <div class="img-wrapper">
              <img 
                [src]="getImageUrl(images[2])" 
                [alt]="images[2].media?.altText || images[2].title || 'Gallery Image 3'"
                (load)="onImageLoad($event, images[2])"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <!-- Image 4: Middle Left Small -->
          <div class="gallery-item item-4" 
               [ngClass]="getAspectRatioClass(images[3])"
               #parallaxItem4
               (mousemove)="onMouseMove($event, parallaxItem4)"
               (mouseleave)="onMouseLeave(parallaxItem4)"
               *ngIf="images[3]">
            <div class="img-wrapper">
              <img 
                [src]="getImageUrl(images[3])" 
                [alt]="images[3].media?.altText || images[3].title || 'Gallery Image 4'"
                (load)="onImageLoad($event, images[3])"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <!-- Image 5: Middle Right Large -->
          <div class="gallery-item item-5" 
               [ngClass]="getAspectRatioClass(images[4])"
               #parallaxItem5
               (mousemove)="onMouseMove($event, parallaxItem5)"
               (mouseleave)="onMouseLeave(parallaxItem5)"
               *ngIf="images[4]">
            <div class="img-wrapper">
              <img 
                [src]="getImageUrl(images[4])" 
                [alt]="images[4].media?.altText || images[4].title || 'Gallery Image 5'"
                (load)="onImageLoad($event, images[4])"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <!-- Image 6: Bottom Left Large -->
          <div class="gallery-item item-6" 
               [ngClass]="getAspectRatioClass(images[5])"
               #parallaxItem6
               (mousemove)="onMouseMove($event, parallaxItem6)"
               (mouseleave)="onMouseLeave(parallaxItem6)"
               *ngIf="images[5]">
            <div class="img-wrapper">
              <img 
                [src]="getImageUrl(images[5])" 
                [alt]="images[5].media?.altText || images[5].title || 'Gallery Image 6'"
                (load)="onImageLoad($event, images[5])"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <!-- Image 7: Bottom Center Tall -->
          <div class="gallery-item item-7" 
               [ngClass]="getAspectRatioClass(images[6])"
               #parallaxItem7
               (mousemove)="onMouseMove($event, parallaxItem7)"
               (mouseleave)="onMouseLeave(parallaxItem7)"
               *ngIf="images[6]">
            <div class="img-wrapper">
              <img 
                [src]="getImageUrl(images[6])" 
                [alt]="images[6].media?.altText || images[6].title || 'Gallery Image 7'"
                (load)="onImageLoad($event, images[6])"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <!-- Center Title Box -->
          <div class="gallery-center-title">
            <h3>PHOTO<br>GALLERY</h3>
          </div>

          <!-- Bottom Right Section with Text and Button -->
          <div class="gallery-cta">
            <p class="cta-text">A glimpse into the<br>spaces we've designed<br>and built.</p>
            <button class="btn-explore-bottom">explore →</button>
          </div>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="!loading && images.length === 0">
          <p>No gallery images available at the moment.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .gallery-section {
      background-color: #D4D9C8;
      padding: 0;
      padding-bottom: 0;
      width: 100%;
      min-height: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 0;
    }

    /* Gallery Container */
    .gallery-container {
      width: 1440px;
      max-width: 100%;
      margin: 0 auto;
      padding: 0 20px;
      flex: 1;
    }

    /* Skeleton Loading */
    .skeleton-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-auto-rows: 180px;
      gap: 16px;
    }

    .skeleton {
      height: 100%;
      background: linear-gradient(
        90deg,
        #e0e0e0 25%,
        #f5f5f5 50%,
        #e0e0e0 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 6px;
    }

    .skeleton:nth-child(1) { grid-column: span 2; grid-row: span 1; }
    .skeleton:nth-child(2) { grid-column: span 1; grid-row: span 2; }
    .skeleton:nth-child(3) { grid-column: span 1; grid-row: span 2; }
    .skeleton:nth-child(4) { grid-column: span 1; grid-row: span 1; }
    .skeleton:nth-child(5) { grid-column: span 2; grid-row: span 1; }
    .skeleton:nth-child(6) { grid-column: span 2; grid-row: span 2; }
    .skeleton:nth-child(7) { grid-column: span 1; grid-row: span 2; }
    .skeleton-title { grid-column: span 1; grid-row: span 2; }
    .skeleton-cta { grid-column: span 1; grid-row: span 2; }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Gallery Grid Layout - Flexible span-based approach */
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-auto-rows: 180px;
      gap: 16px;
      background-color: #D4D9C8;
      position: relative;
      width: 100%;
      max-width: 1440px;
      margin: 0 auto;
    }

    .gallery-item {
      overflow: hidden;
      border-radius: 0;
      position: relative;
      background: #eaeaea;
    }

    /* Image wrapper for controlled overflow */
    .img-wrapper {
      overflow: hidden;
      border-radius: 10px;
      position: relative;
      width: 100%;
      height: 100%;
    }

    /* Light overlay on hover */
    .img-wrapper::after {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.1);
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
      z-index: 1;
    }

    .gallery-item:hover .img-wrapper::after {
      opacity: 1;
    }

    .img-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transform: scale(1);
      transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
      will-change: transform;
    }

    /* Premium smooth zoom on hover */
    .gallery-item:hover .img-wrapper img {
      transform: scale(1.08);
    }

    /* Dynamic Aspect Ratio Classes */
    .gallery-item.landscape .img-wrapper img {
      aspect-ratio: 4 / 3;
    }

    .gallery-item.portrait .img-wrapper img {
      aspect-ratio: 3 / 4;
    }

    .gallery-item.square .img-wrapper img {
      aspect-ratio: 1 / 1;
    }

    /* Item 1: Top Left Large - spans 2 columns, 1 row */
    .item-1 {
      grid-column: span 2;
      grid-row: span 1;
    }

    /* Item 2: Top Center Tall - spans 1 column, 2 rows */
    .item-2 {
      grid-column: span 1;
      grid-row: span 2;
    }

    /* Item 3: Top Right - spans 1 column, 2 rows */
    .item-3 {
      grid-column: span 1;
      grid-row: span 2;
    }

    /* Item 4: Middle Left Small - spans 1 column, 1 row */
    .item-4 {
      grid-column: span 1;
      grid-row: span 1;
    }

    /* Item 5: Middle Right Large - spans 2 columns, 1 row */
    .item-5 {
      grid-column: span 2;
      grid-row: span 1;
    }

    /* Item 6: Bottom Left Large - spans 2 columns, 2 rows */
    .item-6 {
      grid-column: span 2;
      grid-row: span 2;
    }

    /* Item 7: Bottom Center Tall - spans 1 column, 2 rows */
    .item-7 {
      grid-column: span 1;
      grid-row: span 2;
    }

    /* Center Title Box - spans 1 column, 2 rows */
    .gallery-center-title {
      grid-column: span 1;
      grid-row: span 2;
      background-color: #1B4332;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 8px solid #FFFFFF;
      box-sizing: border-box;
    }

    .gallery-center-title h3 {
      color: #FFFFFF;
      font-size: 42px;
      font-weight: 400;
      line-height: 1.2;
      text-align: center;
      margin: 0;
      letter-spacing: 2px;
      font-family: 'Sofia Sans', sans-serif;
    }

    /* Bottom Right CTA Section - spans 1 column, 2 rows */
    .gallery-cta {
      grid-column: span 1;
      grid-row: span 2;
      background-color: #C8D4BA;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 30px;
      text-align: center;
    }

    .cta-text {
      font-size: 18px;
      color: #1B4332;
      line-height: 1.6;
      margin-bottom: 25px;
      font-weight: 500;
    }

    .btn-explore-bottom {
      background-color: #1B4332;
      color: #FFFFFF;
      border: none;
      padding: 12px 32px;
      font-size: 16px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .btn-explore-bottom:hover {
      background-color: #2D5A45;
      transform: translateY(-2px);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      font-size: 18px;
      color: #2D3E2E;
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Responsive Design */
    @media (max-width: 1440px) {
      .gallery-container {
        width: 100%;
      }
    }

    @media (max-width: 1024px) {
      .gallery-section {
        min-height: auto;
      }

      .gallery-grid,
      .skeleton-grid {
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: 200px;
        gap: 12px;
      }

      .item-1,
      .item-2,
      .item-3,
      .item-4,
      .item-5,
      .item-6,
      .item-7,
      .gallery-center-title,
      .gallery-cta,
      .skeleton {
        grid-column: span 1 !important;
        grid-row: span 1 !important;
      }
    }

    @media (max-width: 768px) {
      .section-title {
        font-size: 36px;
      }

      .gallery-grid,
      .skeleton-grid {
        grid-template-columns: 1fr;
        grid-auto-rows: 220px;
        gap: 10px;
      }

      .gallery-center-title h3 {
        font-size: 32px;
      }

      .gallery-header {
        margin-top: 40px;
        margin-bottom: 40px;
      }

      .gallery-title-box {
        padding: 25px 40px;
      }
    }
  `]
})
export class GalleryComponent implements OnInit {
  images: GalleryImage[] = [];
  loading = false;
  loadedCount = 0;

  constructor(
    private galleryService: GalleryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadGalleryImages();
  }

  loadGalleryImages() {
    this.loading = true;
    console.log('Loading gallery images... loading =', this.loading);
    this.galleryService.getFeaturedImages().subscribe({
      next: (response) => {
        console.log('Gallery API Response:', response);
        if (response.success && response.data) {
          const content = response.data.content || [];
          this.images = content.slice(0, 7);
          console.log('Loaded images count:', this.images.length);
          if (this.images.length > 0) {
            console.log('First image:', this.images[0]);
            console.log('First image media:', this.images[0].media);
            console.log('First image URL:', this.getImageUrl(this.images[0]));
          }
        }
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Loading complete. loading =', this.loading, 'images.length =', this.images.length);
      },
      error: (error) => {
        console.error('Error loading gallery:', error);
        this.loading = false;
        console.log('Loading error. loading =', this.loading);
      }
    });
  }

  getImageUrl(image: GalleryImage): string {
    return image.media?.url || 'assets/placeholder-gallery.jpg';
  }

  getAspectRatioClass(image: GalleryImage | undefined): string {
    if (!image) return '';
    
    // Use backend-provided aspect ratio if available
    if (image.media?.aspectRatio) {
      return image.media.aspectRatio;
    }
    
    // Use computed aspect ratio as fallback
    if (image.computedAspectRatio) {
      return image.computedAspectRatio;
    }
    
    return '';
  }

  onImageLoad(event: Event, image: GalleryImage): void {
    // Only compute if backend didn't provide aspect ratio
    if (!image.media?.aspectRatio) {
      const imgEl = event.target as HTMLImageElement;
      const width = imgEl.naturalWidth;
      const height = imgEl.naturalHeight;
      
      if (width && height) {
        const ratio = width / height;
        
        if (ratio > 1.2) {
          image.computedAspectRatio = 'landscape';
        } else if (ratio < 0.8) {
          image.computedAspectRatio = 'portrait';
        } else {
          image.computedAspectRatio = 'square';
        }
        
        // Trigger change detection to update the class
        this.cdr.detectChanges();
      }
    }

    // Track loaded images for animations
    this.loadedCount++;
    
    // Initialize animations when all images are loaded
    if (this.loadedCount === this.images.length) {
      this.initScrollParallax();
    }
  }

  // Cursor-based parallax effect
  onMouseMove(event: MouseEvent, element: HTMLElement): void {
    const rect = element.getBoundingClientRect();
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const moveX = (x - centerX) / 20;
    const moveY = (y - centerY) / 20;
    
    const img = element.querySelector('img') as HTMLElement;
    
    if (img) {
      img.style.transform = `scale(1.08) translate(${moveX}px, ${moveY}px)`;
    }
  }

  onMouseLeave(element: HTMLElement): void {
    const img = element.querySelector('img') as HTMLElement;
    
    if (img) {
      img.style.transform = 'scale(1) translate(0, 0)';
    }
  }

  // Scroll-based parallax effect (subtle depth)
  initScrollParallax(): void {
    if (typeof window === 'undefined') return;

    const items = document.querySelectorAll('.gallery-item .img-wrapper img');
    
    if (items.length === 0) return;

    // Simple scroll parallax without GSAP dependency
    const handleScroll = () => {
      items.forEach((img, i) => {
        const rect = img.getBoundingClientRect();
        const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        
        if (scrollProgress >= 0 && scrollProgress <= 1) {
          const movement = i % 2 === 0 ? 20 : -20;
          const translateY = (scrollProgress - 0.5) * movement;
          
          const currentTransform = (img as HTMLElement).style.transform || '';
          const scaleMatch = currentTransform.match(/scale\([^)]+\)/);
          const translateMatch = currentTransform.match(/translate\([^)]+\)/);
          
          const scale = scaleMatch ? scaleMatch[0] : 'scale(1)';
          const translateX = translateMatch ? translateMatch[0].match(/translate\(([^,]+)/)?.[1] || '0' : '0';
          
          (img as HTMLElement).style.transform = `${scale} translate(${translateX}, ${translateY}px)`;
        }
      });
    };

    // Throttle scroll events for performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll(); // Initial call
  }

  trackById(index: number, item: GalleryImage): number {
    return item.id;
  }
}
