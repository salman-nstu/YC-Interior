import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutService } from '../shared/services/about.service';
import { AboutSection } from '../shared/models/about.model';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { FooterComponent } from '../shared/components/footer/footer.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="about-page">
      <!-- Section 1: About Us -->
      <section class="about-section section-padding">
        <div class="container">
          <div class="content-grid">
            <div class="text-content">
              <h2 class="section-title">ABOUT<br>YC INTERIOR<br>& BUILDERS</h2>
              <p class="description" *ngIf="aboutUs">{{ aboutUs.description }}</p>
              <p class="description" *ngIf="!aboutUs && !loading">Loading about information...</p>
            </div>
            <div class="image-content">
              <img src="/yc-assets/download11.jpg" alt="YC Interior & Builders" class="section-image" />
            </div>
          </div>
        </div>
      </section>

      <!-- Section 2: Message from Founder -->
      <section class="founder-section section-padding">
        <div class="container">
          <div class="founder-grid">
            <div class="founder-title-wrapper">
              <h2 class="section-title">MESSAGE<br>FROM<br>FOUNDER</h2>
            </div>
            <div class="founder-message-box">
              <div class="quote-icon quote-top">"</div>
              <p class="founder-message" *ngIf="chairmanMessage">{{ chairmanMessage.description }}</p>
              <p class="founder-message" *ngIf="!chairmanMessage && !loading">Loading founder's message...</p>
              <div class="quote-icon quote-bottom">"</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 3: Why Choose Us -->
      <section class="why-choose-section section-padding">
        <div class="container">
          <h2 class="section-title centered">WHY CHOOSE US?</h2>
          <div class="content-grid">
            <div class="image-content">
              <img src="/yc-assets/yy.jpg" alt="Why Choose Us" class="section-image" />
            </div>
            <div class="text-content">
              <p class="description" *ngIf="whyChooseUs">{{ whyChooseUs.description }}</p>
              <p class="description" *ngIf="!whyChooseUs && !loading">Loading information...</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 4: Company Overview -->
      <section class="overview-section section-padding">
        <div class="container">
          <div class="overview-grid">
            <div class="overview-title-wrapper">
              <h2 class="section-title">COMPANY<br>OVERVIEW</h2>
            </div>
            <div class="text-content">
              <div class="overview-box">
                <p class="description" *ngIf="companyOverview">{{ companyOverview.description }}</p>
                <p class="description" *ngIf="!companyOverview && !loading">Loading company overview...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    
    <app-footer></app-footer>
  `,
  styles: [`
    .about-page {
      background-color: #DAE2CB;
      min-height: 100vh;
    }

    .section-padding {
      padding: 80px 0;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 40px;
    }

    .section-title {
      font-family: 'Ade', serif;
      font-size: 72px;
      font-weight: 400;
      line-height: 1.1;
      color: #46563B;
      margin: 0 0 40px 0;
      letter-spacing: 1px;
    }

    .section-title.centered {
      text-align: center;
      margin-bottom: 60px;
    }

    .description {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 18px;
      line-height: 1.8;
      color: #2d2d2d;
      margin: 0;
      text-align: justify;
    }

    /* Section 1: About Us */
    .about-section {
      .content-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 80px;
        align-items: center;
      }

      .text-content {
        padding-right: 40px;
      }

      .section-image {
        width: 100%;
        height: 600px;
        object-fit: cover;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      }
    }

    /* Section 2: Message from Founder */
    .founder-section {
      .founder-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 80px;
        align-items: center;
      }

      .founder-title-wrapper {
        display: flex;
        align-items: center;
      }

      .founder-message-box {
        background-color: #46563BC9;
        border-radius: 20px;
        padding: 60px;
        position: relative;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      }

      .quote-icon {
        font-family: Georgia, serif;
        font-size: 80px;
        color: rgba(255, 255, 255, 0.3);
        line-height: 1;
      }

      .quote-top {
        position: absolute;
        top: 20px;
        left: 30px;
      }

      .quote-bottom {
        position: absolute;
        bottom: 20px;
        right: 30px;
      }

      .founder-message {
        font-family: 'Sofia Sans', sans-serif;
        font-size: 20px;
        line-height: 1.8;
        color: #ffffff;
        margin: 40px 0;
        text-align: center;
        position: relative;
        z-index: 1;
      }
    }

    /* Section 3: Why Choose Us */
    .why-choose-section {
      .content-grid {
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: 80px;
        align-items: center;
      }

      .image-content {
        .section-image {
          width: 100%;
          height: 500px;
          object-fit: cover;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }
      }

      .text-content {
        padding-left: 40px;
      }
    }

    /* Section 4: Company Overview */
    .overview-section {
      .overview-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 80px;
        align-items: center;
      }

      .overview-title-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }

      .text-content {
        padding-left: 40px;
      }

      .overview-box {
        border: 3px solid #46563B;
        padding: 50px;
        border-radius: 8px;
        background-color: transparent;
      }
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .section-padding {
        padding: 60px 0;
      }

      .container {
        padding: 0 30px;
      }

      .section-title {
        font-size: 56px;
      }

      .about-section .content-grid,
      .why-choose-section .content-grid,
      .founder-section .founder-grid,
      .overview-section .overview-grid {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .about-section .text-content,
      .why-choose-section .text-content,
      .overview-section .text-content {
        padding: 0;
      }

      .overview-section .overview-box {
        padding: 30px;
      }

      .founder-section .founder-message-box {
        padding: 40px;
      }

      .about-section .section-image,
      .why-choose-section .section-image {
        height: 400px;
      }
    }

    @media (max-width: 768px) {
      .about-page {
        padding-top: 60px;
      }

      .section-padding {
        padding: 40px 0;
      }

      .container {
        padding: 0 20px;
      }

      .section-title {
        font-size: 42px;
        margin-bottom: 30px;
      }

      .description {
        font-size: 16px;
      }

      .founder-section {
        .founder-message-box {
          padding: 30px;
        }

        .founder-message {
          font-size: 18px;
          margin: 30px 0;
        }

        .quote-icon {
          font-size: 60px;
        }
      }

      .overview-section .overview-box {
        padding: 25px;
      }

      .about-section .section-image,
      .why-choose-section .section-image {
        height: 300px;
      }
    }
  `]
})
export class AboutPageComponent implements OnInit {
  aboutUs: AboutSection | null = null;
  whyChooseUs: AboutSection | null = null;
  chairmanMessage: AboutSection | null = null;
  companyOverview: AboutSection | null = null;
  loading = true;

  constructor(
    private aboutService: AboutService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Force immediate scroll to top with no animation
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    this.loadAboutSections();
  }

  loadAboutSections() {
    this.loading = true;
    this.aboutService.getAboutSections(0, 10).subscribe({
      next: (response: any) => {
        console.log('About sections response:', response);
        if (response.success && response.data) {
          const sections = response.data.content || response.data;
          
          // Map sections by ID (assuming IDs 1-4 correspond to the sections)
          // You may need to adjust this based on your actual data structure
          this.aboutUs = sections.find((s: AboutSection) => s.id === 1) || sections[0];
          this.whyChooseUs = sections.find((s: AboutSection) => s.id === 2) || sections[1];
          this.chairmanMessage = sections.find((s: AboutSection) => s.id === 3) || sections[2];
          this.companyOverview = sections.find((s: AboutSection) => s.id === 4) || sections[3];
          
          console.log('Loaded sections:', {
            aboutUs: this.aboutUs,
            whyChooseUs: this.whyChooseUs,
            chairmanMessage: this.chairmanMessage,
            companyOverview: this.companyOverview
          });
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading about sections:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
