import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AboutService } from '../../../shared/services/about.service';
import { AnimationsService } from '../../../shared/services/animations.service';
import { AboutSection } from '../../../shared/models/about.model';
import { gsap } from 'gsap';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="about-section" id="about" [style.background-image]="'url(/yc-assets/download1.jpg)'">
      <div class="overlay"></div>
      <div class="container">
        <div class="about-content">
          <h2 class="section-title typing-title">
            <span class="typing-text"></span>
            <span class="typing-cursor">|</span>
          </h2>
          
          <div class="about-text-wrapper">
            <ng-container *ngIf="!loading && aboutSection && aboutSection.description">
              <div class="about-text">
                <p>{{ aboutSection.description }}</p>
                <button (click)="navigateToAbout()" class="btn-learn-more">learn more →</button>
              </div>
            </ng-container>

            <ng-container *ngIf="loading">
              <div class="about-text">
                <p>Loading...</p>
              </div>
            </ng-container>

            <ng-container *ngIf="!loading && (!aboutSection || !aboutSection.description)">
              <div class="about-text">
                <p>No about section available. Please add content from the admin panel.</p>
              </div>
            </ng-container>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-section {
      padding: 120px 0;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
      min-height: 600px;
      display: flex;
      align-items: center;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to right, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.4) 100%);
      z-index: 1;
    }

    .container {
      position: relative;
      z-index: 2;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 60px;
      width: 100%;
    }

    .about-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
      width: 100%;
    }

    .section-title {
      font-family: 'Ade Display', serif;
      font-size: 5rem;
      color: #ffffff;
      font-weight: 400;
      letter-spacing: 0.02em;
      margin: 0;
      text-align: left;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .typing-text {
      display: inline-block;
    }

    .typing-cursor {
      display: inline-block;
      animation: blink 0.7s infinite;
      font-weight: 300;
      opacity: 1;
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    .about-text-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }
    
    .about-text {
      background-color: #789258CC;
      padding: 50px 60px;
      border-radius: 12px;
      backdrop-filter: blur(5px);
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .about-text p {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 1.05rem;
      line-height: 1.9;
      color: #ffffff;
      margin: 0;
    }
    
    .btn-learn-more {
      background-color: rgba(255, 255, 255, 0.95);
      color: #2d6a4f;
      padding: 12px 32px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      align-self: flex-start;
      text-decoration: none;
      display: inline-block;
    }
    
    .btn-learn-more:hover {
      background-color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 968px) {
      .about-section {
        padding: 80px 0;
        min-height: 500px;
      }

      .container {
        padding: 0 30px;
      }

      .about-content {
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
      }
      
      .section-title {
        font-size: 3rem;
        text-align: center;
        justify-content: center;
      }

      .about-text {
        padding: 30px 40px;
      }

      .about-text p {
        font-size: 1rem;
      }

      .about-text-wrapper {
        align-items: center;
      }

      .btn-learn-more {
        align-self: center;
      }
    }
  `]
})
export class AboutComponent implements OnInit, AfterViewInit {
  aboutSection: AboutSection | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private aboutService: AboutService,
    private animationsService: AnimationsService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAbout();
  }

  ngAfterViewInit() {
    // Initialize typing animation when section comes into view
    setTimeout(() => {
      this.initTypingAnimation();
      this.animationsService.initAboutAnimation();
    }, 100);
  }

  initTypingAnimation() {
    const text = "ABOUT US";
    const typingElement = document.querySelector('.typing-text');
    const cursorElement = document.querySelector('.typing-cursor');
    
    if (!typingElement) return;

    // Start with empty text
    typingElement.textContent = '';
    
    // Create typing animation with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 70%',
        once: true
      }
    });

    // Type each letter one by one
    text.split('').forEach((char, index) => {
      tl.to(typingElement, {
        duration: 0.1,
        onStart: () => {
          typingElement.textContent += char;
        }
      });
    });

    // Hide cursor after typing is complete
    tl.to(cursorElement, {
      opacity: 0,
      duration: 0.3,
      delay: 0.5,
      onComplete: () => {
        if (cursorElement) {
          (cursorElement as HTMLElement).style.display = 'none';
        }
      }
    });
  }

  navigateToAbout() {
    // First, scroll to top instantly (before navigation)
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    // Then navigate to about page
    this.router.navigate(['/about']);
  }

  loadAbout() {
    this.loading = true;
    this.error = null;
    console.log('Loading about sections...');
    
    this.aboutService.getAboutSections(0, 1).subscribe({
      next: (response) => {
        console.log('About API Response:', response);
        if (response.success && response.data && response.data.content && response.data.content.length > 0) {
          this.aboutSection = response.data.content[0];
          console.log('About section loaded:', this.aboutSection);
        } else {
          console.log('No about sections found in response');
          this.error = 'No about section available';
          this.aboutSection = null;
        }
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Loading state after API call:', this.loading);
      },
      error: (error) => {
        console.error('Error loading about:', error);
        this.error = 'Failed to load about section';
        this.loading = false;
        this.aboutSection = null;
        this.cdr.detectChanges();
      }
    });
  }
}
