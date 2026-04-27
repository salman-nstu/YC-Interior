import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-static-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="static-section">
      <div class="container">
        <div class="content-wrapper">
          <div class="text-content">
            <h2 class="section-title">
              <span class="line line-1">DISCOVER</span>
              <span class="line line-2">STYLES</span>
              <span class="line line-3">MATCH</span>
              <span class="line line-4">PERSONALI<span class="white-text">TY</span></span>
            </h2>
            <p class="section-description">
              Modern interior design and construction solutions tailored to your lifestyle.
            </p>
          </div>
          <div class="image-content">
            <div class="image-wrapper">
              <img src="/yc-assets/image 2.jpg" alt="Interior Design" />
              <div class="overlay-text">
                <span class="overlay-line overlay-that">THAT</span>
                <span class="overlay-line overlay-your">YOUR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .static-section {
      padding: 80px 0;
      background-color: #D0D1AF;
      overflow: hidden;
    }

    .container {
      max-width: 1600px;
      margin: 0 auto;
      padding: 0 60px;
    }

    .content-wrapper {
      display: grid;
      grid-template-columns: 50% 50%;
      align-items: center;
      position: relative;
    }

    .text-content {
      padding-right: 0;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-left: 80px;
    }

    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: 5rem;
      line-height: 1.2;
      margin-bottom: 30px;
      color: #000000;
      font-weight: 400;
      letter-spacing: 0.01em;
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .section-title .line {
      display: block;
      white-space: nowrap;
    }

    .line-1 {
      padding-left: 0;
    }

    .line-2 {
      padding-left: 80px;
    }

    .line-3 {
      padding-left: 150px;
    }

    .line-4 {
      padding-left: 48px;
      position: relative;
    }

    .white-text {
      color: #ffffff;
      position: relative;
      z-index: 10;
    }
    
    .section-description {
      font-size: 1.125rem;
      color: #4a4a4a;
      line-height: 1.7;
      max-width: 480px;
      margin-top: 20px;
      align-self: flex-start;
      font-weight: 600;
    }

    .image-content {
      position: relative;
      margin-left: -120px;
    }

    .image-wrapper {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    }
    
    .image-wrapper img {
      width: 100%;
      height: 550px;
      object-fit: cover;
      display: block;
    }
    
    .overlay-text {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      pointer-events: none;
    }
    
    .overlay-line {
      font-family: 'Playfair Display', serif;
      font-size: 5rem;
      color: #ffffff;
      font-weight: 400;
      letter-spacing: 0.01em;
      text-shadow: 2px 2px 12px rgba(0, 0, 0, 0.4);
      line-height: 1.2;
      display: block;
      position: absolute;
    }

    .overlay-that {
      top: 140px;
      left: 60px;
    }

    .overlay-your {
      top: 240px;
      left: 140px;
    }

    @media (max-width: 1200px) {
      .section-title {
        font-size: 4rem;
      }

      .overlay-line {
        font-size: 4rem;
      }

      .image-content {
        margin-left: -60px;
      }

      .text-content {
        padding-left: 40px;
      }
    }

    @media (max-width: 968px) {
      .content-wrapper {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .image-content {
        margin-left: 0;
      }

      .text-content {
        padding-left: 0;
        align-items: flex-start;
      }
      
      .section-title {
        font-size: 3rem;
      }

      .overlay-line {
        font-size: 3rem;
      }

      .overlay-that {
        top: 60px;
        left: 40px;
      }

      .overlay-your {
        top: 140px;
        left: 100px;
      }

      .image-wrapper img {
        height: 400px;
      }
    }
  `]
})
export class StaticSectionComponent {}
