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
      <div class="reviews-container">
        <!-- Left Side: Quote Icon and Description -->
        <div class="reviews-left">
          <div class="quote-icon">
            <svg width="136" height="124" viewBox="0 0 136 124" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M46.928 55.9631H28.678C26.505 55.9631 24.658 55.1474 23.137 53.515C21.617 51.8825 20.856 49.9002 20.856 47.568V44.7711C20.856 38.5913 22.893 33.3162 26.967 28.9437C31.041 24.5723 35.957 22.3861 41.714 22.3861H46.928C48.34 22.3861 49.562 21.8323 50.594 20.7247C51.626 19.6171 52.142 18.3056 52.142 16.7901V5.59706C52.142 4.08161 51.626 2.76902 50.594 1.66141C49.562 0.554877 48.34 0 46.928 0H41.714C36.065 0 30.675 1.18166 25.542 3.54176C20.409 5.90294 15.969 9.09482 12.221 13.1174C8.473 17.1389 5.5 21.9042 3.3 27.4133C1.1 32.9223 0 38.7083 0 44.7711V106.329C0 110.995 1.52 114.957 4.562 118.222C7.604 121.486 11.298 123.118 15.643 123.118H46.93C51.275 123.118 54.968 121.486 58.01 118.222C61.051 114.957 62.572 110.995 62.572 106.329V72.7521C62.572 68.0877 61.051 64.1252 58.008 60.8593C54.967 57.5955 51.273 55.9631 46.928 55.9631Z" fill="#084734" fill-opacity="0.95"/>
              <path d="M131.011 60.8593C127.97 57.5955 124.277 55.9631 119.931 55.9631H101.681C99.509 55.9631 97.661 55.1474 96.142 53.515C94.621 51.8825 93.861 49.9002 93.861 47.568V44.7711C93.861 38.5913 95.898 33.3162 99.97 28.9437C104.043 24.5723 108.959 22.3861 114.718 22.3861H119.931C121.343 22.3861 122.566 21.8323 123.597 20.7247C124.629 19.6171 125.146 18.3056 125.146 16.7901V5.59706C125.146 4.08161 124.629 2.76902 123.597 1.66141C122.566 0.554877 121.343 0 119.931 0H114.718C109.066 0 103.677 1.18166 98.543 3.54176C93.411 5.90294 88.972 9.09482 85.224 13.1174C81.476 17.1389 78.502 21.9042 76.302 27.4133C74.103 32.9223 73.002 38.7083 73.002 44.7711V106.329C73.002 110.995 74.523 114.957 77.564 118.222C80.605 121.486 84.298 123.118 88.644 123.118H119.929C124.276 123.118 127.968 121.486 131.009 118.222C134.052 114.957 135.571 110.995 135.571 106.329V72.7521C135.571 68.0877 134.052 64.1252 131.011 60.8593Z" fill="#084734" fill-opacity="0.95"/>
            </svg>
          </div>
          
          <p class="reviews-subtitle">what our<br>customers are<br>saying</p>
        </div>
        
        <!-- Right Side: Reviews Carousel -->
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
      </div>
    </section>
  `,
  styles: [`
    /* SECTION BG */
    .reviews-section {
      background: #E8E4D9;
      padding: 100px 60px;
      overflow: hidden;
    }

    .reviews-container {
      display: flex;
      align-items: center;
      gap: 60px;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Left Side */
    .reviews-left {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }

    /* Quote Icon - Bigger */
    .quote-icon {
      display: flex;
      
      svg path {
        fill: #084734F2;
      }
    }

    /* Subtitle */
    .reviews-subtitle {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 20px;
      font-weight: 500;
      color: #3a3a3a;
      margin: 0;
      text-transform: lowercase;
      line-height: 1.4;
    }

    /* WRAPPER */
    .reviews-carousel-wrapper {
      position: relative;
      overflow: hidden;
      flex: 1;
      min-width: 0;
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
    @media (max-width: 1200px) {
      .reviews-section {
        padding: 80px 40px;
      }

      .reviews-container {
        gap: 40px;
      }

      .quote-icon svg {
        width: 110px;
        height: auto;
      }

      .reviews-subtitle {
        font-size: 18px;
      }

      .review-card {
        width: 380px;
        height: 220px;
      }

      .carousel-track {
        gap: 28px;
      }
    }

    @media (max-width: 968px) {
      .reviews-section {
        padding: 60px 30px;
      }

      .reviews-container {
        flex-direction: column;
        gap: 40px;
        align-items: center;
      }

      .reviews-left {
        align-items: center;
        text-align: center;
      }

      .reviews-subtitle br {
        display: none;
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
        padding: 50px 20px;
      }

      .quote-icon svg {
        width: 90px;
        height: auto;
      }

      .reviews-subtitle {
        font-size: 16px;
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
      if (!this.loading && this.displayReviews.length > 0) {
        console.log('AfterViewInit: Initializing marquee');
        console.log('Track element:', this.track);
        this.initMarquee();
      }
    }, 500);
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
          console.log('Attempting to initialize marquee...');
          console.log('Display reviews length:', this.displayReviews.length);
          console.log('Track element:', this.track);
          if (this.displayReviews.length > 0) {
            this.initMarquee();
          } else {
            console.log('Cannot init marquee - no reviews');
          }
        }, 500);
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.loading = false;
      }
    });
  }

  initMarquee() {
    console.log('initMarquee called');
    console.log('Track reference:', this.track);
    
    if (!this.track) {
      console.error('Track ViewChild is undefined');
      return;
    }
    
    if (!this.track.nativeElement) {
      console.error('Track nativeElement not found');
      return;
    }
    
    const el = this.track.nativeElement;
    console.log('Track element:', el);
    console.log('Track scrollWidth:', el.scrollWidth);
    console.log('Track children count:', el.children.length);
    
    // Total width of half content (one set of reviews)
    const totalWidth = el.scrollWidth / 2;
    console.log('Total width for animation:', totalWidth);
    
    if (totalWidth === 0) {
      console.error('Total width is 0, cannot animate');
      return;
    }
    
    // Kill existing animation if any
    if (this.marqueeAnimation) {
      this.marqueeAnimation.kill();
    }
    
    this.marqueeAnimation = gsap.to(el, {
      x: -totalWidth,
      duration: 30, // Slower for testing
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x: string) => parseFloat(x) % totalWidth)
      },
      onStart: () => {
        console.log('GSAP animation started successfully');
      },
      onUpdate: () => {
        // Log occasionally to verify animation is running
        if (Math.random() < 0.01) {
          console.log('Animation running, x:', el.style.transform);
        }
      }
    });
    
    console.log('GSAP animation created:', this.marqueeAnimation);
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  trackById(index: number, item: Review): number {
    return item.id;
  }
}
