import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqService } from '../../../shared/services/faq.service';
import { FAQ } from '../../../shared/models/faq.model';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="faq-section">
      <div class="container">
        <div class="faq-grid">
          <div class="faq-image">
            <img src="/yc-assets/pexels-iremonat-14564071.jpg" alt="FAQ" />
          </div>
          
          <div class="faq-content">
            <h2 class="section-title">QUESTIONS YOU MAY HAVE</h2>
            <p class="section-subtitle">We've picked out our most frequently asked questions</p>
            
            <div class="faq-list" *ngIf="faqs.length > 0">
              <div class="faq-item" *ngFor="let faq of faqs; let i = index" (click)="toggleFaq(i)">
                <div class="faq-question">
                  <span>{{ faq.question }}</span>
                  <span class="faq-icon">{{ expandedIndex === i ? '-' : '+' }}</span>
                </div>
                <div class="faq-answer" *ngIf="expandedIndex === i">
                  <p>{{ faq.answer }}</p>
                </div>
              </div>
            </div>
            
            <div class="empty-state" *ngIf="faqs.length === 0 && !loading">
              <p>No FAQs available at the moment.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .faq-section {
      padding: var(--spacing-xl) 0;
      background-color: var(--color-beige-light);
    }

    .faq-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 4rem;
      align-items: start;
    }

    .faq-image {
      img {
        width: 100%;
        height: 600px;
        object-fit: cover;
        border-radius: var(--radius-lg);
      }
    }

    .faq-content {
      .section-title {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: var(--color-text-dark);
      }
      
      .section-subtitle {
        font-size: 1rem;
        color: var(--color-text-light);
        margin-bottom: 2rem;
      }
    }

    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .faq-item {
      border-bottom: 1px solid var(--color-text-light);
      padding-bottom: 1rem;
      cursor: pointer;
      
      .faq-question {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1rem;
        color: var(--color-text-dark);
        padding: 1rem 0;
        
        .faq-icon {
          font-size: 1.5rem;
          font-weight: 300;
          color: var(--color-primary-dark);
        }
      }
      
      .faq-answer {
        padding: 1rem 0;
        color: var(--color-text-light);
        line-height: 1.6;
        animation: fadeIn 0.3s ease;
      }
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: var(--color-text-light);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 968px) {
      .faq-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .faq-image img {
        height: 400px;
      }
    }
  `]
})
export class FaqComponent implements OnInit {
  faqs: FAQ[] = [];
  loading = true;
  expandedIndex: number | null = null;

  constructor(private faqService: FaqService) {}

  ngOnInit() {
    this.faqService.getAllFaqs().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.faqs = response.data;
        }
        setTimeout(() => this.loading = false, 0);
      },
      error: (error) => {
        console.error('Error loading FAQs:', error);
        setTimeout(() => this.loading = false, 0);
      }
    });
  }

  toggleFaq(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
}
