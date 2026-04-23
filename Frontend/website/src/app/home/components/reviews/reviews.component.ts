import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../shared/services/review.service';
import { Review } from '../../../shared/models/review.model';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="reviews-section">
      <div class="container">
        <div class="quote-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <path d="M20 50V30C20 20 25 15 35 15H40V25H35C30 25 28 27 28 32V35H40V50H20ZM50 50V30C50 20 55 15 65 15H70V25H65C60 25 58 27 58 32V35H70V50H50Z" fill="currentColor"/>
          </svg>
        </div>
        
        <p class="reviews-subtitle">what our customers are saying</p>
        
        <div class="reviews-carousel" *ngIf="reviews.length > 0">
          <div class="carousel-track">
            <div class="review-card" *ngFor="let review of displayReviews">
              <div class="review-header">
                <div class="reviewer-icon">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill="currentColor" opacity="0.2"/>
                    <path d="M20 20C23.3137 20 26 17.3137 26 14C26 10.6863 23.3137 8 20 8C16.6863 8 14 10.6863 14 14C14 17.3137 16.6863 20 20 20ZM20 22C15.5817 22 8 24.2183 8 28.6667V32H32V28.6667C32 24.2183 24.4183 22 20 22Z" fill="currentColor"/>
                  </svg>
                </div>
                <div class="reviewer-info">
                  <h4 class="reviewer-name">{{ review.clientName }}</h4>
                  <div class="rating">
                    <span *ngFor="let star of getStars(review.rating)">★</span>
                  </div>
                </div>
              </div>
              <p class="review-text">{{ review.comment }}</p>
            </div>
          </div>
        </div>
        
        <div class="carousel-dots" *ngIf="reviews.length > 0">
          <span class="dot" *ngFor="let review of reviews; let i = index" [class.active]="i === 0"></span>
        </div>
        
        <div class="empty-state" *ngIf="reviews.length === 0 && !loading">
          <p>No reviews available at the moment.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .reviews-section {
      padding: var(--spacing-xl) 0;
      background-color: var(--color-cream);
      text-align: center;
    }

    .quote-icon {
      color: var(--color-primary-dark);
      margin-bottom: 1rem;
      
      svg {
        opacity: 0.3;
      }
    }

    .reviews-subtitle {
      font-size: 0.9rem;
      color: var(--color-text-light);
      margin-bottom: 3rem;
      text-transform: lowercase;
    }

    .reviews-carousel {
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .carousel-track {
      display: flex;
      gap: 2rem;
      animation: scrollReviews 40s linear infinite;
      
      &:hover {
        animation-play-state: paused;
      }
    }

    .review-card {
      flex-shrink: 0;
      width: 400px;
      background: rgba(149, 169, 156, 0.2);
      border-radius: var(--radius-lg);
      padding: 2rem;
      text-align: left;
      
      .review-header {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
        
        .reviewer-icon {
          color: var(--color-primary-dark);
        }
        
        .reviewer-info {
          .reviewer-name {
            font-size: 1.1rem;
            margin-bottom: 0.25rem;
            color: var(--color-text-dark);
          }
          
          .rating {
            color: #fbbf24;
            font-size: 1rem;
          }
        }
      }
      
      .review-text {
        color: var(--color-text-dark);
        line-height: 1.6;
        font-size: 0.95rem;
      }
    }

    .carousel-dots {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-text-light);
        opacity: 0.3;
        transition: opacity 0.3s;
        
        &.active {
          opacity: 1;
          background: var(--color-primary-dark);
        }
      }
    }

    .empty-state {
      padding: 3rem;
      color: var(--color-text-light);
    }

    @keyframes scrollReviews {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    @media (max-width: 768px) {
      .review-card {
        width: 300px;
      }
    }
  `]
})
export class ReviewsComponent implements OnInit {
  reviews: Review[] = [];
  displayReviews: Review[] = [];
  loading = false;

  constructor(private reviewService: ReviewService) {}

  ngOnInit() {
    this.loading = true;
    this.reviewService.getAllReviews().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.reviews = response.data;
          // Duplicate reviews for infinite scroll effect
          this.displayReviews = [...this.reviews, ...this.reviews];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.loading = false;
      }
    });
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
