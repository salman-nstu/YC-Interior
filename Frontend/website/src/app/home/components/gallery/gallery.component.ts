import { Component, OnInit, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { GalleryService } from '../../../shared/services/gallery.service';
import { AnimationsService } from '../../../shared/services/animations.service';
import { GalleryImage } from '../../../shared/models/gallery.model';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ],
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
          <!-- TOP ROW: 3 images above the title box -->
          <div class="gallery-item item-1" 
               #parallaxItem1
               (mousemove)="onMouseMove($event, parallaxItem1)"
               (mouseleave)="onMouseLeave(parallaxItem1)"
               (click)="openLightbox(0)"
               *ngIf="images[0]">
            <div class="img-wrapper">
              <img 
                [src]="getImageUrl(images[0])" 
                [alt]="images[0].media?.altText || images[0].title || 'Gallery Image 1'"
                (load)="onImageLoad($event, images[0])"
                loading="lazy"
              />
            </div>
          </div>

          <div class="gallery-item item-2" 
               #parallaxItem2
               (mousemove)="onMouseMove($event, parallaxItem2)"
               (mouseleave)="onMouseLeave(parallaxItem2)"
               (click)="openLightbox(1)"
               *ngIf="images[1]">
            <div class="img-wrapper">
              <img 
                [src]="getImageUrl(images[1])" 
                [alt]="images[1].media?.altText || images[1].title || 'Gallery Image 2'"
                (load)="onImageLoad($event, images[1])"
                loading="lazy"
              />
            </div>
          </div>

          <div class="gallery-item item-3" 
               #parallaxItem3
               (mousemove)="onMouseMove($event, parallaxItem3)"
               (mouseleave)="onMouseLeave(parallaxItem3)"
               (click)="openLightbox(2)"
               *ngIf="images[2]">
            <div class="img-wrapper">
              <img 
                [src]="getImageUrl(images[2])" 
                [alt]="images[2].media?.altText || images[2].title || 'Gallery Image 3'"
                (load)="onImageLoad($event, images[2])"
                loading="lazy"
              />
            </div>
          </div>

          <!-- MIDDLE ROW: Left image, Title box, Right image -->
          <div class="gallery-item item-4" 
               #parallaxItem4
               (mousemove)="onMouseMove($event, parallaxItem4)"
               (mouseleave)="onMouseLeave(parallaxItem4)"
               (click)="openLightbox(3)"
               *ngIf="images[3]">
            <div class="img-wrapper">
              <img 
                [src]="getImageUrl(images[3])" 
                [alt]="images[3].media?.altText || images[3].title || 'Gallery Image 4'"
                (load)="onImageLoad($event, images[3])"
                loading="lazy"
              />
            </div>
          </div>

          <!-- Center Title Box -->
          <div class="gallery-center-title">
            <h3>PHOTO<br>GALLERY</h3>
          </div>

          <div class="gallery-item item-5" 
               #parallaxItem5
               (mousemove)="onMouseMove($event, parallaxItem5)"
               (mouseleave)="onMouseLeave(parallaxItem5)"
               (click)="openLightbox(4)"
               *ngIf="images[4]">
            <div class="img-wrapper">
              <img 
                [src]="getImageUrl(images[4])" 
                [alt]="images[4].media?.altText || images[4].title || 'Gallery Image 5'"
                (load)="onImageLoad($event, images[4])"
                loading="lazy"
              />
            </div>
          </div>

          <!-- BOTTOM ROW: 2 images on left, CTA box on right -->
          <div class="gallery-item item-6" 
               #parallaxItem6
               (mousemove)="onMouseMove($event, parallaxItem6)"
               (mouseleave)="onMouseLeave(parallaxItem6)"
               (click)="openLightbox(5)"
               *ngIf="images[5]">
            <div class="img-wrapper">
              <img 
                [src]="getImageUrl(images[5])" 
                [alt]="images[5].media?.altText || images[5].title || 'Gallery Image 6'"
                (load)="onImageLoad($event, images[5])"
                loading="lazy"
              />
            </div>
          </div>

          <div class="gallery-item item-7" 
               #parallaxItem7
               (mousemove)="onMouseMove($event, parallaxItem7)"
               (mouseleave)="onMouseLeave(parallaxItem7)"
               (click)="openLightbox(6)"
               *ngIf="images[6]">
            <div class="img-wrapper">
              <img 
                [src]="getImageUrl(images[6])" 
                [alt]="images[6].media?.altText || images[6].title || 'Gallery Image 7'"
                (load)="onImageLoad($event, images[6])"
                loading="lazy"
              />
            </div>
          </div>

          <!-- Bottom Right Section with Text and Button -->
          <div class="gallery-cta">
            <p class="cta-text">A glimpse into the<br>spaces we've designed<br>and built.</p>
            <button class="btn-explore-bottom" (click)="navigateToGallery()">explore →</button>
          </div>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="!loading && images.length === 0">
          <p>No gallery images available at the moment.</p>
        </div>
      </div>

      <!-- Lightbox Modal -->
      <div class="lightbox-overlay" 
           *ngIf="lightboxOpen" 
           (click)="closeLightbox()"
           [@fadeIn]>
        <div class="lightbox-container">
          <!-- Close Button -->
          <button class="lightbox-close" (click)="closeLightbox()">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- Image -->
          <div class="lightbox-image-wrapper" (click)="$event.stopPropagation()">
            <img 
              [src]="getImageUrl(images[currentImageIndex])" 
              [alt]="images[currentImageIndex]?.media?.altText || images[currentImageIndex]?.title || 'Gallery Image'"
              class="lightbox-image"
            />
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .gallery-section {
      background-color: #D4D9C8;
      padding: 60px 0;
      width: 100%;
      min-height: auto;
    }

    /* Gallery Container */
    .gallery-container {
      width: 1440px;
      max-width: 100%;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Skeleton Loading */
    .skeleton-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      grid-template-rows: repeat(3, 250px);
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

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Gallery Grid Layout - Matching Prototype */
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      grid-template-rows: repeat(3, 250px);
      gap: 16px;
      background-color: #D4D9C8;
      position: relative;
      width: 100%;
      max-width: 1440px;
      margin: 0 auto;
    }

    .gallery-item {
      overflow: hidden;
      border-radius: 10px;
      position: relative;
      background: #eaeaea;
      cursor: pointer;
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

    /* TOP ROW: 3 images above title box */
    /* Item 1: Small left */
    .item-1 {
      grid-column: 1 / 3;
      grid-row: 1 / 2;
    }

    /* Item 2: Large center */
    .item-2 {
      grid-column: 3 / 5;
      grid-row: 1 / 2;
    }

    /* Item 3: Small right */
    .item-3 {
      grid-column: 5 / 7;
      grid-row: 1 / 2;
    }

    /* MIDDLE ROW: Left image, Title box, Right image */
    /* Item 4: Left side (smaller) */
    .item-4 {
      grid-column: 1 / 3;
      grid-row: 2 / 3;
    }

    /* Center Title Box */
    .gallery-center-title {
      grid-column: 3 / 5;
      grid-row: 2 / 3;
      background-color: #15503E;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 8px solid #FFFFFF;
      box-sizing: border-box;
      border-radius: 10px;
    }

    .gallery-center-title h3 {
      color: #FFFFFF;
      font-size: 48px;
      font-weight: 400;
      line-height: 1.2;
      text-align: center;
      margin: 0;
      letter-spacing: 2px;
      font-family: 'Ade Display', 'Georgia', serif;
    }

    /* Item 5: Right side (larger) */
    .item-5 {
      grid-column: 5 / 7;
      grid-row: 2 / 3;
    }

    /* BOTTOM ROW: 2 images on left, CTA box on right */
    /* Item 6: Bottom left (smaller) */
    .item-6 {
      grid-column: 1 / 3;
      grid-row: 3 / 4;
    }

    /* Item 7: Bottom center (larger) */
    .item-7 {
      grid-column: 3 / 5;
      grid-row: 3 / 4;
    }

    /* Bottom Right CTA Section */
    .gallery-cta {
      grid-column: 5 / 7;
      grid-row: 3 / 4;
      background-color: #CFD0AEB2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 30px;
      text-align: center;
      border-radius: 10px;
    }

    .cta-text {
      font-size: 18px;
      color: #15503E;
      line-height: 1.6;
      margin-bottom: 25px;
      font-weight: 500;
    }

    .btn-explore-bottom {
      background-color: #15503E;
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
      background-color: #15503E;
      transform: translateY(-2px);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      font-size: 18px;
      color: #15503E;
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
      .gallery-grid,
      .skeleton-grid {
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4, 200px);
        gap: 12px;
      }

      .item-1 {
        grid-column: 1 / 3;
        grid-row: 1 / 2;
      }

      .item-2 {
        grid-column: 3 / 5;
        grid-row: 1 / 2;
      }

      .item-3 {
        grid-column: 1 / 3;
        grid-row: 2 / 3;
      }

      .item-4 {
        grid-column: 3 / 5;
        grid-row: 2 / 3;
      }

      .gallery-center-title {
        grid-column: 1 / 3;
        grid-row: 3 / 4;
      }

      .item-5 {
        grid-column: 3 / 5;
        grid-row: 3 / 4;
      }

      .item-6 {
        grid-column: 1 / 3;
        grid-row: 4 / 5;
      }

      .item-7 {
        grid-column: 3 / 5;
        grid-row: 4 / 5;
      }

      .gallery-cta {
        grid-column: 1 / 5;
        grid-row: 5 / 6;
      }

      .gallery-center-title h3 {
        font-size: 36px;
      }
    }

    @media (max-width: 768px) {
      .gallery-grid,
      .skeleton-grid {
        grid-template-columns: 1fr;
        grid-auto-rows: 220px;
        gap: 10px;
      }

      .item-1,
      .item-2,
      .item-3,
      .item-4,
      .item-5,
      .item-6,
      .item-7,
      .gallery-center-title,
      .gallery-cta {
        grid-column: 1 / 2 !important;
        grid-row: auto !important;
      }

      .gallery-center-title h3 {
        font-size: 32px;
      }
    }

    /* Lightbox Styles */
    .lightbox-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      background: rgba(212, 217, 200, 0.85);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      overflow: hidden;
      cursor: pointer;
    }

    .lightbox-container {
      position: relative;
      width: 100%;
      max-width: 1400px;
      height: 90vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lightbox-image-wrapper {
      position: relative;
      max-width: 100%;
      max-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: default;
    }

    .lightbox-image {
      max-width: 100%;
      max-height: 90vh;
      width: auto;
      height: auto;
      object-fit: contain;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .lightbox-close {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(27, 67, 50, 0.9);
      border: none;
      color: white;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: 10001;
    }

    .lightbox-close:hover {
      background: rgba(27, 67, 50, 1);
      transform: rotate(90deg) scale(1.1);
    }

    @media (max-width: 768px) {
      .lightbox-overlay {
        padding: 20px;
      }

      .lightbox-image {
        max-height: 80vh;
      }

      .lightbox-close {
        top: 10px;
        right: 10px;
        width: 45px;
        height: 45px;
      }
    }
  `]
})
export class GalleryComponent implements OnInit, AfterViewInit {
  images: GalleryImage[] = [];
  loading = false;
  loadedCount = 0;
  
  // Lightbox properties
  lightboxOpen = false;
  currentImageIndex = 0;

  constructor(
    private galleryService: GalleryService,
    private animationsService: AnimationsService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  // Keyboard navigation for lightbox
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.lightboxOpen) return;
    
    if (event.key === 'Escape') {
      this.closeLightbox();
    }
  }

  ngOnInit() {
    this.loadGalleryImages();
  }

  ngAfterViewInit() {
    // Initialize premium gallery animations while preserving all existing functionality
    setTimeout(() => {
      this.animationsService.initGalleryAnimation();
    }, 100);
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

  // Lightbox methods
  openLightbox(index: number): void {
    this.currentImageIndex = index;
    this.lightboxOpen = true;
    // Store current scroll position
    const scrollY = window.scrollY;
    // Prevent background scrolling - multiple approaches for cross-browser compatibility
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;
    // Store scroll position as data attribute for restoration
    document.body.setAttribute('data-scroll-y', scrollY.toString());
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    // Restore scrolling and scroll position
    const scrollY = document.body.getAttribute('data-scroll-y');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    document.body.removeAttribute('data-scroll-y');
    // Restore scroll position
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY, 10));
    }
  }

  navigateToGallery(): void {
    this.router.navigate(['/gallery']);
  }
}
