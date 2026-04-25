import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../shared/services/review.service';
import { Review } from '../../../shared/models/review.model';
import { gsap } from 'gsap';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="reviews-section">
      <!-- Quote Icon -->
      <div class="quote-icon">
        <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 37.5V22.5C15 15 18.75 11.25 26.25 11.25H30V18.75H26.25C22.5 18.75 21 20.25 21 24V26.25H30V37.5H15ZM37.5 37.5V22.5C37.5 15 41.25 11.25 48.75 11.25H52.5V18.75H48.75C45 18.75 43.5 20.25 43.5 24V26.25H52.5V37.5H37.5Z" 
                fill="#5a6f5e" opacity="0.8"/>
        </svg>
      </div>
      
      <!-- Subtitle -->
      <p class="reviews-subtitle">what our customers are saying</p>
      
      <!-- Reviews Carousel -->
      <div class="reviews-carousel-wrapper">
        <!-- Loading State -->
        <div class="carousel-track loading-track" *ngIf="loading">
          <div class="review-card skeleton">
            <div class="skeleton-shimmer"></div>
          </div>
          <div class="review-card skeleton">
            <div class="skeleton-shimmer"></div>
          </div>
          <div class="review-card skeleton">
            <div class="skeleton-shimmer"></div>
          </div>
        </div>
        
        <!-- Review Cards -->
        <div class="carousel-track" 
             #track
             *ngIf="!loading && displayReviews.length > 0">
          <div class="review-card" 
               *ngFor="let review of displayReviews; trackBy: trackById">
            <!-- Header -->
            <div class="review-header">
              <div class="avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#2E4A3F"/>
                  <path d="M12 14C6.48 14 2 16.24 2 19V22H22V19C22 16.24 17.52 14 12 14Z" fill="#2E4A3F"/>
                </svg>
              </div>
              
              <div class="review-meta">
                <h4>{{ review.name }}</h4>
                <div class="stars" *ngIf="review.rating">
                  <span *ngFor="let star of getStars(review.rating)">★</span>
                </div>
              </div>
            </div>
            
            <!-- Divider -->
            <div class="divider"></div>
            
            <!-- Content Box -->
            <div class="review-body">
              {{ review.description || 'Sample review content here...' }}
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div class="empty-state" *ngIf="!loading && reviews.length === 0">
          <p>No reviews available at the moment.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* SECTION BG */
    .reviews-section {
      background: #E8E4D9;
      padding: 100px 0;
      overflow: hidden;
    }

    /* Quote Icon */
    .quote-icon {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      
      svg path {
        fill: #5a6f5e;
        opacity: 0.8;
      }
    }

    /* Subtitle */
    .reviews-subtitle {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 18px;
      font-weight: 500;
      color: #3a3a3a;
      text-align: center;
      margin: 0 0 50px 0;
      text-transform: lowercase;
    }

    /* WRAPPER */
    .reviews-carousel-wrapper {
      position: relative;
      overflow: hidden;
      width: 100%;
    }

    /* EDGE FADE */
    .reviews-carousel-wrapper::before,
    .reviews-carousel-wrapper::after {
      content: "";
      position: absolute;
      top: 0;
      width: 120px;
      height: 100%;
      z-index: 2;
      pointer-events: none;
    }

    .reviews-carousel-wrapper::before {
      left: 0;
      background: linear-gradient(to right, #E8E4D9, transparent);
    }

    .reviews-carousel-wrapper::after {
      right: 0;
      background: linear-gradient(to left, #E8E4D9, transparent);
    }

    /* TRACK */
    .carousel-track {
      display: flex;
      gap: 32px;
      width: max-content;
    }

    .loading-track {
      justify-content: center;
      width: 100%;
    }

    /* CARD */
    .review-card {
      width: 420px;
      height: 240px;
      background: #8FA39A;
      border-radius: 24px;
      padding: 24px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* HEADER */
    .review-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* AVATAR */
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid #2E4A3F;
      background: rgba(46, 74, 63, 0.2);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        width: 24px;
        height: 24px;
        
        path {
          fill: #2E4A3F;
        }
      }
    }

    /* META */
    .review-meta {
      flex: 1;
      
      h4 {
        margin: 0 0 4px 0;
        font-family: 'Sofia Sans', sans-serif;
        font-size: 16px;
        font-weight: 600;
        color: #1f1f1f;
      }
    }

    .stars {
      font-size: 14px;
      color: #FFD700;
      letter-spacing: 2px;
    }

    /* DIVIDER */
    .divider {
      height: 1px;
      background: #2E4A3F;
      opacity: 0.4;
      margin: 12px 0;
    }

    /* INNER BOX */
    .review-body {
      flex: 1;
      border: 1.5px solid #2E4A3F;
      border-radius: 16px;
      padding: 16px;
      font-family: 'Sofia Sans', sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #2E4A3F;
      display: flex;
      align-items: center;
      overflow: hidden;
    }

    /* Loading State */
    .review-card.skeleton {
      background: rgba(143, 163, 154, 0.5);
      position: relative;
      overflow: hidden;
    }

    .skeleton-shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.2) 50%,
        transparent 100%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      
      p {
        font-family: 'Sofia Sans', sans-serif;
        font-size: 16px;
        color: #5a5a5a;
        margin: 0;
      }
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .reviews-section {
        padding: 80px 0;
      }

      .review-card {
        width: 380px;
        height: 220px;
      }

      .carousel-track {
        gap: 28px;
      }
    }

    @media (max-width: 768px) {
      .reviews-section {
        padding: 60px 0;
      }

      .review-card {
        width: 320px;
        height: 200px;
        padding: 20px;
      }

      .carousel-track {
        gap: 24px;
      }

      .review-meta h4 {
        font-size: 14px;
      }

      .review-body {
        font-size: 13px;
        padding: 14px;
      }

      .reviews-carousel-wrapper::before,
      .reviews-carousel-wrapper::after {
        width: 80px;
      }
    }

    @media (max-width: 480px) {
      .reviews-section {
        padding: 50px 0;
      }

      .review-card {
        width: 280px;
        height: 180px;
        padding: 18px;
      }

      .carousel-track {
        gap: 20px;
      }

      .avatar {
        width: 36px;
        height: 36px;
      }

      .review-meta h4 {
        font-size: 13px;
      }

      .review-body {
        font-size: 12px;
        padding: 12px;
      }

      .reviews-carousel-wrapper::before,
      .reviews-carousel-wrapper::after {
        width: 60px;
      }
    }
  `]
})
export class ReviewsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('track', { static: false }) track!: ElementRef;
  
  reviews: Review[] = [];
  displayReviews: Review[] = [];
  loading = true;
  marqueeAnimation: any;

  constructor(
    private reviewService: ReviewService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadReviews();
  }

  ngAfterViewInit() {
    // Retry marquee initialization if data is already loaded
    setTimeout(() => {
      if (!this.loading && this.displayReviews.length > 0 && this.track) {
        console.log('AfterViewInit: Initializing marquee');
        this.initMarquee();
      }
    }, 300);
  }

  ngOnDestroy() {
    if (this.marqueeAnimation) {
      this.marqueeAnimation.kill();
    }
  }

  loadReviews() {
    this.loading = true;
    this.reviewService.getAllReviews().subscribe({
      next: (response) => {
        console.log('Reviews API Response:', response);
        if (response.success && response.data) {
          // Handle paginated response
          const reviewData = Array.isArray(response.data) 
            ? response.data 
            : (response.data as any).content || [];
          
          console.log('Review Data:', reviewData);
          
          // Filter featured reviews
          this.reviews = reviewData.filter((r: Review) => r.isFeatured !== false);
          
          console.log('Filtered Reviews:', this.reviews);
          
          // Duplicate once for seamless loop
          if (this.reviews.length > 0) {
            this.displayReviews = [...this.reviews, ...this.reviews];
            console.log('Display Reviews:', this.displayReviews);
          }
        }
        this.loading = false;
        this.cdr.detectChanges();
        
        // Initialize marquee after view updates
        setTimeout(() => {
          if (this.displayReviews.length > 0 && this.track) {
            console.log('Initializing marquee...');
            this.initMarquee();
          } else {
            console.log('Cannot init marquee:', {
              hasReviews: this.displayReviews.length > 0,
              hasTrack: !!this.track
            });
          }
        }, 200);
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.loading = false;
      }
    });
  }

  initMarquee() {
    if (!this.track || !this.track.nativeElement) {
      console.error('Track element not found');
      return;
    }
    
    const el = this.track.nativeElement;
    console.log('Track element:', el);
    console.log('Track scrollWidth:', el.scrollWidth);
    
    // Total width of half content (one set of reviews)
    const totalWidth = el.scrollWidth / 2;
    console.log('Total width for animation:', totalWidth);
    
    if (totalWidth === 0) {
      console.error('Total width is 0, cannot animate');
      return;
    }
    
    this.marqueeAnimation = gsap.to(el, {
      x: -totalWidth,
      duration: 20, // Control speed (lower = faster)
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x: string) => parseFloat(x) % totalWidth)
      },
      onStart: () => {
        console.log('GSAP animation started');
      }
    });
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  trackById(index: number, item: Review): number {
    return item.id;
  }
}
