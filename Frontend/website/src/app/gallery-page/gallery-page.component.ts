import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { GalleryService } from '../shared/services/gallery.service';
import { GalleryImage } from '../shared/models/gallery.model';
import { ApiResponse, PageResponse } from '../shared/models/api.model';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="gallery-page">
      <div class="container">
        <h1 class="page-title">PHOTO<br>GALLERY</h1>
        
        <div class="gallery-grid" *ngIf="!loading && images.length > 0">
          <div class="gallery-item" *ngFor="let image of images" (click)="openLightbox(image)">
            <div class="image-wrapper">
              <img [src]="image.media?.url" [alt]="image.media?.altText || image.title" />
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div class="pagination" *ngIf="!loading && totalPages > 1">
          <button 
            class="pagination-btn" 
            [disabled]="currentPage === 0"
            (click)="goToPage(currentPage - 1)">
            ← Previous
          </button>
          
          <div class="pagination-numbers">
            <button 
              *ngFor="let page of getPageNumbers()" 
              class="page-number"
              [class.active]="page === currentPage"
              (click)="goToPage(page)">
              {{ page + 1 }}
            </button>
          </div>
          
          <button 
            class="pagination-btn" 
            [disabled]="currentPage === totalPages - 1"
            (click)="goToPage(currentPage + 1)">
            Next →
          </button>
        </div>
        
        <div class="loading-state" *ngIf="loading">
          <p>Loading gallery...</p>
        </div>
        
        <div class="empty-state" *ngIf="!loading && images.length === 0">
          <p>No images available at the moment.</p>
        </div>
      </div>
    </div>
    
    <!-- Lightbox Modal -->
    <div class="lightbox-overlay" *ngIf="lightboxOpen" (click)="closeLightbox()">
      <div class="lightbox-container" (click)="$event.stopPropagation()">
        <button class="lightbox-close" (click)="closeLightbox()">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="lightbox-image-wrapper">
          <img 
            [src]="selectedImage?.media?.url" 
            [alt]="selectedImage?.media?.altText || selectedImage?.title"
            class="lightbox-image"
          />
        </div>
      </div>
    </div>
    
    <app-footer></app-footer>
  `,
  styles: [`
    .gallery-page {
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
      font-size: 96px;
      font-weight: 400;
      color: #2C3E2F;
      margin-bottom: 60px;
      line-height: 1.1;
      letter-spacing: 2px;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 60px;
    }

    .gallery-item {
      aspect-ratio: 1;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      }
    }

    .image-wrapper {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
      background-color: #e5e5e5;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
      }
    }

    .gallery-item:hover .image-wrapper img {
      transform: scale(1.08);
    }

    /* Pagination Styles */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 60px;
    }

    .pagination-btn {
      background-color: #46563B;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 15px;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      
      &:hover:not(:disabled) {
        background-color: #5a6e4a;
        transform: translateY(-2px);
      }
      
      &:disabled {
        background-color: #a0a0a0;
        cursor: not-allowed;
        opacity: 0.5;
      }
    }

    .pagination-numbers {
      display: flex;
      gap: 8px;
    }

    .page-number {
      width: 44px;
      height: 44px;
      border-radius: 6px;
      border: 2px solid #46563B;
      background-color: transparent;
      color: #46563B;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: #46563B;
        color: white;
      }
      
      &.active {
        background-color: #46563B;
        color: white;
      }
    }

    .loading-state,
    .empty-state {
      text-align: center;
      padding: 80px 20px;
      font-size: 18px;
      color: #2C3E2F;
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
      background: rgba(212, 217, 200, 0.9);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      overflow: hidden;
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
      background: rgba(70, 86, 59, 0.9);
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
      background: rgba(70, 86, 59, 1);
      transform: rotate(90deg) scale(1.1);
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .container {
        padding: 0 40px;
      }

      .gallery-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }

      .page-title {
        font-size: 64px;
      }
    }

    @media (max-width: 768px) {
      .gallery-page {
        padding: 60px 0;
      }

      .container {
        padding: 0 20px;
      }

      .gallery-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .page-title {
        font-size: 48px;
        margin-bottom: 40px;
      }

      .pagination {
        flex-direction: column;
        gap: 12px;
      }

      .pagination-numbers {
        order: -1;
      }

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
export class GalleryPageComponent implements OnInit {
  images: GalleryImage[] = [];
  loading = true;
  currentPage = 0;
  pageSize = 15;
  totalPages = 0;
  totalElements = 0;
  
  // Lightbox
  lightboxOpen = false;
  selectedImage: GalleryImage | null = null;

  constructor(
    private galleryService: GalleryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'auto' });
    this.loadImages();
  }

  loadImages() {
    this.loading = true;
    this.galleryService.getAllImages(this.currentPage, this.pageSize).subscribe({
      next: (response: ApiResponse<PageResponse<GalleryImage>>) => {
        if (response.success && response.data) {
          this.images = response.data.content;
          this.totalPages = response.data.totalPages;
          this.totalElements = response.data.totalElements;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading gallery images:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadImages();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      for (let i = 0; i < this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(0, this.currentPage - 2);
      let endPage = Math.min(this.totalPages - 1, this.currentPage + 2);
      
      if (this.currentPage < 2) {
        endPage = Math.min(this.totalPages - 1, 4);
      } else if (this.currentPage > this.totalPages - 3) {
        startPage = Math.max(0, this.totalPages - 5);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  openLightbox(image: GalleryImage) {
    this.selectedImage = image;
    this.lightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightboxOpen = false;
    this.selectedImage = null;
    document.body.style.overflow = '';
  }
}
