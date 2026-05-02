import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqService } from '../../../shared/services/faq.service';
import { FAQ } from '../../../shared/models/faq.model';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="faq-section">
      <div class="faq-container">
        <!-- Left Side: Title and Image -->
        <div class="faq-left">
          <h2 class="section-title">QUESTIONS YOU MAY HAVE</h2>
          <div class="faq-image">
            <img src="yc-assets/download11.jpg" alt="Interior Design" />
          </div>
        </div>
        
        <!-- Right Side: Subtitle and FAQ List -->
        <div class="faq-right">
          <p class="section-subtitle">We've picked out our most frequently asked questions.</p>
          
          <!-- Loading State -->
          <div class="loading-state" *ngIf="loading">
            <div class="skeleton-item" *ngFor="let i of [1,2,3,4,5,6]">
              <div class="skeleton-shimmer"></div>
            </div>
          </div>
          
          <!-- FAQ List -->
          <div class="faq-list" *ngIf="!loading && faqs.length > 0">
            <div class="faq-item" 
                 *ngFor="let faq of faqs; let i = index; trackBy: trackById"
                 [class.expanded]="expandedIndex === i">
              <div class="faq-question" (click)="toggleFaq(i)">
                <span class="question-text">{{ faq.question }}</span>
                <span class="faq-toggle-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 7.5L10 12.5L15 7.5" 
                          stroke="currentColor" 
                          stroke-width="1.5" 
                          stroke-linecap="round" 
                          stroke-linejoin="round"
                          [style.transform]="expandedIndex === i ? 'rotate(180deg)' : 'rotate(0deg)'"
                          style="transition: transform 0.3s ease;" />
                  </svg>
                </span>
              </div>
              <div class="faq-answer-wrapper" [class.show]="expandedIndex === i">
                <div class="faq-answer">
                  <p>{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div class="empty-state" *ngIf="!loading && faqs.length === 0">
            <p>No FAQs available at the moment.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .faq-section {
      background: #BAA0857A;
      padding: 80px 60px;
      position: relative;
    }

    .faq-container {
      max-width: 1440px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 80px;
      align-items: start;
    }

    /* Left Side */
    .faq-left {
      .section-title {
        font-family: 'Sofia Sans', sans-serif;
        font-size: 28px;
        font-weight: 600;
        letter-spacing: 0.02em;
        color: #2d2d2d;
        margin: 0 0 40px 0;
        line-height: 1.3;
        text-transform: uppercase;
        white-space: nowrap;
      }
    }

    .faq-image {
      img {
        width: 100%;
        height: auto;
        aspect-ratio: 3/4;
        object-fit: cover;
        border-radius: 4px;
        display: block;
      }
    }

    /* Right Side */
    .faq-right {
      .section-subtitle {
        font-family: 'Sofia Sans', sans-serif;
        font-size: 18px;
        font-weight: 400;
        color: #5a5a5a;
        margin: 0 0 40px 0;
        line-height: 1.5;
      }
    }

    /* Loading State */
    .loading-state {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .skeleton-item {
      height: 60px;
      background: rgba(0, 0, 0, 0.05);
      border-bottom: 2px solid rgba(90, 90, 90, 0.2);
      position: relative;
      overflow: hidden;
    }

    .skeleton-shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.3) 50%,
        transparent 100%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* FAQ List */
    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .faq-item {
      border-bottom: 3px solid rgba(90, 90, 90, 0.5);
      transition: all 0.3s ease;
      
      &:last-child {
        border-bottom: 3px solid rgba(90, 90, 90, 0.5);
      }
    }

    .faq-question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        .question-text {
          color: #1a1a1a;
        }
      }
      
      .question-text {
        font-family: 'Sofia Sans', sans-serif;
        font-size: 16px;
        font-weight: 500;
        color: #3d3d3d;
        line-height: 1.5;
        flex: 1;
        padding-right: 20px;
        transition: color 0.3s ease;
      }
      
      .faq-toggle-icon {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        color: #5a5a5a;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .faq-answer-wrapper {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.4s ease, opacity 0.3s ease;
      opacity: 0;
      
      &.show {
        max-height: 500px;
        opacity: 1;
        padding-bottom: 20px;
      }
    }

    .faq-answer {
      padding-top: 0;
      
      p {
        font-family: 'Sofia Sans', sans-serif;
        font-size: 15px;
        font-weight: 400;
        color: #5a5a5a;
        line-height: 1.7;
        margin: 0;
      }
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
    @media (max-width: 1440px) {
      .faq-section {
        padding: 70px 40px;
      }

      .faq-container {
        gap: 60px;
      }
    }

    @media (max-width: 1024px) {
      .faq-section {
        padding: 60px 30px;
      }

      .faq-container {
        grid-template-columns: 1fr;
        gap: 50px;
      }

      .faq-left {
        display: flex;
        flex-direction: column;
        gap: 30px;
        
        .section-title {
          margin: 0;
        }
      }

      .faq-image img {
        max-width: 200px;
        aspect-ratio: 4/3;
      }
    }

    @media (max-width: 768px) {
      .faq-section {
        padding: 50px 20px;
      }

      .faq-container {
        gap: 30px;
      }

      .faq-left .section-title {
        font-size: 24px;
      }

      .faq-right .section-subtitle {
        font-size: 14px;
        margin-bottom: 30px;
      }

      .faq-question .question-text {
        font-size: 15px;
      }

      .faq-answer p {
        font-size: 14px;
      }

      .faq-image img {
        max-width: 180px;
        aspect-ratio: 16/9;
      }
    }

    @media (max-width: 480px) {
      .faq-section {
        padding: 40px 15px;
      }

      .faq-container {
        gap: 25px;
      }

      .faq-left {
        gap: 20px;
      }

      .faq-left .section-title {
        font-size: 20px;
      }

      .faq-right .section-subtitle {
        font-size: 13px;
        margin-bottom: 20px;
      }

      .faq-question {
        padding: 16px 0;
      }

      .faq-question .question-text {
        font-size: 14px;
      }

      .faq-answer p {
        font-size: 13px;
      }

      .faq-image img {
        max-width: 160px;
        aspect-ratio: 16/9;
      }
    }
  `]
})
export class FaqComponent implements OnInit {
  faqs: FAQ[] = [];
  loading = true;
  expandedIndex: number | null = null;

  constructor(private faqService: FaqService, private cdr: ChangeDetectorRef, private zone: NgZone) {}

  ngOnInit() {
    this.loadFaqs();
  }

  loadFaqs() {
    this.loading = true;
    this.faqService.getAllFaqs().subscribe({
      next: (response) => {
        this.zone.run(() => {
          if (response.success && response.data) {
            // Check if data is an array or has content property
            const faqData = Array.isArray(response.data) 
              ? response.data 
              : (response.data as any).content || [];
            
            // Sort by displayOrder
            this.faqs = faqData.sort((a: FAQ, b: FAQ) => 
              (a.displayOrder || 0) - (b.displayOrder || 0)
            );
          }
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        console.error('Error loading FAQs:', error);
        this.zone.run(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  toggleFaq(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  trackById(index: number, item: FAQ): number {
    return item.id;
  }
}
