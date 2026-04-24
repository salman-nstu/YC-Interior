import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticService } from '../../../shared/services/statistic.service';
import { Statistic } from '../../../shared/models/statistic.model';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="stats-wrapper">
      <!-- Layer 1: Gradient Strip (Figma Node) -->
      <div class="bg-strip"></div>

      <!-- Layer 2: Loading State -->
      <div class="cards-container loading-state" *ngIf="loading">
        <div class="stat-card skeleton" *ngFor="let i of [1,2,3]">
          <div class="skeleton-shimmer"></div>
        </div>
      </div>

      <!-- Layer 3: Floating Cards -->
      <div class="cards-container" *ngIf="!loading && statistics.length > 0">
        <!-- Card 1: Left -->
        <div class="stat-card card-1" 
             *ngIf="statistics[0]"
             #statCard>
          <img [src]="getStatImage(statistics[0].icon)" 
               [alt]="statistics[0].label"
               class="card-image" />
          <div class="overlay">
            <h2 class="stat-number" #statNumber>0</h2>
            <p class="stat-label">{{ statistics[0].label }}</p>
          </div>
        </div>

        <!-- Card 2: Center -->
        <div class="stat-card card-2" 
             *ngIf="statistics[1]"
             #statCard>
          <img [src]="getStatImage(statistics[1].icon)" 
               [alt]="statistics[1].label"
               class="card-image" />
          <div class="overlay">
            <h2 class="stat-number" #statNumber>0</h2>
            <p class="stat-label">{{ statistics[1].label }}</p>
          </div>
        </div>

        <!-- Card 3: Right -->
        <div class="stat-card card-3" 
             *ngIf="statistics[2]"
             #statCard>
          <img [src]="getStatImage(statistics[2].icon)" 
               [alt]="statistics[2].label"
               class="card-image" />
          <div class="overlay">
            <h2 class="stat-number" #statNumber>0</h2>
            <p class="stat-label">{{ statistics[2].label }}</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!loading && statistics.length === 0">
        <p>No statistics available</p>
      </div>
    </section>
  `,
  styles: [`
    /* WRAPPER - Main container with green background */
    .stats-wrapper {
      position: relative;
      background: #6f7f6d;
      padding: 180px 60px 140px;
      overflow: hidden;
      width: 100%;
    }

    /* LAYER 1: Gradient Strip (Figma Node 45:28) */
    .bg-strip {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 260px;
      background: linear-gradient(
        90deg,
        #cfd0ae 61%,
        #d9d9d9 100%
      );
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
      z-index: 1;
    }

    /* LAYER 2: Cards Container (Floating Layer) */
    .cards-container {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: center;
      gap: 40px;
      width: 100%;
      max-width: 1440px;
      margin: 0 auto;
    }

    /* LAYER 3: Card Base */
    .stat-card {
      position: relative;
      width: 280px;
      height: 420px;
      border-radius: 20px;
      overflow: hidden;
      background: #727E6A;
      flex-shrink: 0;
    }

    /* Card Image */
    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* Text Overlay */
    .overlay {
      position: absolute;
      bottom: 30px;
      left: 25px;
      color: #ffffff;
      z-index: 3;
    }

    /* Stat Number */
    .stat-number {
      font-size: 64px;
      font-weight: 700;
      margin: 0;
      line-height: 1;
      font-family: 'Sofia Sans', sans-serif;
    }

    /* Stat Label */
    .stat-label {
      font-size: 16px;
      margin: 8px 0 0 0;
      opacity: 0.9;
      font-family: 'Sofia Sans', sans-serif;
      font-weight: 400;
    }

    /* STAGGERING - Critical for Figma composition */
    .card-1 {
      transform: translateY(80px);
    }

    .card-2 {
      transform: translateY(0px);
    }

    .card-3 {
      transform: translateY(120px);
    }

    /* Loading State */
    .loading-state {
      gap: 40px;
    }

    .stat-card.skeleton {
      background: #5a6658;
      position: relative;
      overflow: hidden;
    }

    .skeleton-shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.1) 50%,
        transparent 100%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      z-index: 3;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      font-size: 18px;
      color: #ffffff;
      min-height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 2;
    }

    /* Responsive Design */
    @media (max-width: 1440px) {
      .stats-wrapper {
        padding: 160px 40px 120px;
      }

      .cards-container {
        gap: 30px;
      }

      .stat-card {
        width: 240px;
        height: 360px;
      }

      .stat-number {
        font-size: 56px;
      }

      .stat-label {
        font-size: 14px;
      }
    }

    @media (max-width: 1024px) {
      .stats-wrapper {
        padding: 120px 30px 100px;
      }

      .bg-strip {
        height: 200px;
      }

      .cards-container {
        flex-wrap: wrap;
        gap: 25px;
      }

      .stat-card {
        width: 220px;
        height: 320px;
      }

      .card-1,
      .card-2,
      .card-3 {
        transform: translateY(0);
      }

      .stat-number {
        font-size: 48px;
      }

      .stat-label {
        font-size: 13px;
      }

      .overlay {
        bottom: 20px;
        left: 20px;
      }
    }

    @media (max-width: 768px) {
      .stats-wrapper {
        padding: 100px 20px 80px;
      }

      .bg-strip {
        height: 150px;
      }

      .cards-container {
        flex-direction: column;
        align-items: center;
        gap: 20px;
      }

      .stat-card {
        width: 100%;
        max-width: 300px;
        height: 280px;
      }

      .stat-number {
        font-size: 40px;
      }

      .stat-label {
        font-size: 12px;
      }
    }

    @media (max-width: 480px) {
      .stats-wrapper {
        padding: 80px 15px 60px;
      }

      .bg-strip {
        height: 120px;
      }

      .cards-container {
        gap: 15px;
      }

      .stat-card {
        width: 100%;
        max-width: 280px;
        height: 240px;
      }

      .stat-number {
        font-size: 32px;
      }

      .stat-label {
        font-size: 11px;
      }

      .overlay {
        bottom: 15px;
        left: 15px;
      }
    }
  `]
})
export class StatsComponent implements OnInit, AfterViewInit {
  statistics: Statistic[] = [];
  loading = false;

  @ViewChildren('statCard') statCards!: QueryList<ElementRef>;
  @ViewChildren('statNumber') statNumbers!: QueryList<ElementRef>;

  // Default images for stats (can be overridden by icon field from DB)
  private defaultImages: { [key: string]: string } = {
    'running': 'yc-assets/download (37).jpg',
    'complete': 'yc-assets/download (38).jpg',
    'success': 'yc-assets/download (39).jpg',
    'default': 'yc-assets/download1.jpg'
  };

  constructor(
    private statisticService: StatisticService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadStatistics();
  }

  ngAfterViewInit() {
    // Animations will be triggered after data loads
  }

  loadStatistics() {
    this.loading = true;
    this.statisticService.getAll().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Sort by displayOrder
          this.statistics = response.data.sort((a, b) => 
            (a.displayOrder || 0) - (b.displayOrder || 0)
          );
        }
        this.loading = false;
        this.cdr.detectChanges();
        
        // Trigger animations after render
        setTimeout(() => {
          this.initCardAnimation();
          this.animateCounters();
        }, 100);
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Dynamic offset calculation (no nth-child hacks)
  getOffset(index: number): number {
    const baseOffset = 40; // Adjust for more/less slope
    return index * baseOffset;
  }

  getStatImage(icon: string): string {
    // If icon is a full URL, use it
    if (icon && (icon.startsWith('http') || icon.startsWith('/'))) {
      return icon;
    }
    
    // Otherwise, try to match with default images
    const key = icon?.toLowerCase() || 'default';
    return this.defaultImages[key] || this.defaultImages['default'];
  }

  // GSAP Card entrance animation
  initCardAnimation() {
    if (this.statCards && this.statCards.length > 0) {
      const cards = this.statCards.map(c => c.nativeElement);
      
      gsap.from(cards, {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cards[0],
          start: 'top 85%',
          once: true
        }
      });
    }
  }

  // Count-up animation synced with scroll
  animateCounters() {
    if (this.statNumbers && this.statNumbers.length > 0) {
      this.statNumbers.forEach((elRef, index) => {
        const el = elRef.nativeElement;
        const stat = this.statistics[index];
        const finalValue = stat.value || 0;
        
        const isPercent = 
          stat.label.toLowerCase().includes('rate') ||
          stat.label.toLowerCase().includes('%') ||
          stat.label.toLowerCase().includes('percent');
        
        const obj = { val: 0 };
        
        gsap.to(obj, {
          val: finalValue,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true
          },
          onUpdate: () => {
            const v = Math.floor(obj.val);
            if (isPercent) {
              el.innerText = `${v}%`;
            } else {
              el.innerText = v < 10 ? `0${v}` : `${v}`;
            }
          }
        });
      });
    }
  }

  trackById(index: number, item: Statistic): number {
    return item.id;
  }
}
