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
              <div class="mobile-overlay">
                <h2 class="mobile-title">
                  DISCOVER STYLES<br>
                  THAT MATCHES YOUR<br>
                  PERSONALITY
                </h2>
                <p class="mobile-description">
                  Modern interior design and construction solutions tailored to your lifestyle.
                </p>
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
      padding: 0 clamp(20px, 4vw, 60px);
    }

    .content-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      position: relative;
      gap: 40px;
    }

    .text-content {
      padding-right: 0;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-left: clamp(20px, 3vw, 80px);
      min-width: 0;
    }

    .section-title {
      font-family: 'Ade Display', serif;
      font-size: clamp(2rem, 4.5vw, 5rem);
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
    }

    .line-1 {
      padding-left: 0;
    }

    .line-2 {
      padding-left: clamp(20px, 5vw, 80px);
    }

    .line-3 {
      padding-left: clamp(30px, 9vw, 150px);
    }

    .line-4 {
      padding-left: clamp(10px, 3vw, 48px);
      position: relative;
    }

    .white-text {
      color: #ffffff;
      position: relative;
      z-index: 10;
    }
    
    .section-description {
      font-family: 'Sofia Sans', sans-serif;
      font-size: clamp(0.9rem, 1.5vw, 1.125rem);
      color: #4a4a4a;
      line-height: 1.7;
      max-width: 480px;
      margin-top: 20px;
      align-self: flex-start;
      font-weight: 600;
    }

    .image-content {
      position: relative;
      margin-left: clamp(-60px, -8vw, -120px);
    }

    .image-wrapper {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    }
    
    .image-wrapper img {
      width: 100%;
      height: clamp(400px, 40vw, 550px);
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
      font-family: 'Ade Display', serif;
      font-size: clamp(2rem, 4.5vw, 5rem);
      color: #ffffff;
      font-weight: 400;
      letter-spacing: 0.01em;
      text-shadow: 2px 2px 12px rgba(0, 0, 0, 0.4);
      line-height: 1.2;
      display: block;
      position: absolute;
    }

    .overlay-that {
      top: clamp(80px, 15vw, 140px);
      left: clamp(30px, 4vw, 60px);
    }

    .overlay-your {
      top: clamp(160px, 25vw, 240px);
      left: clamp(70px, 10vw, 140px);
    }

    .mobile-overlay {
      display: none;
    }

    /* MOBILE ONLY - Direct switch at 768px */
    @media (max-width: 768px) {
      .static-section {
        padding: 60px 0;
      }

      .container {
        padding: 0 20px;
      }

      .content-wrapper {
        display: block;
        position: relative;
      }

      /* Hide desktop layout */
      .text-content {
        display: none;
      }

      .image-content {
        margin-left: 0;
        width: 100%;
      }

      .image-wrapper {
        position: relative;
        border-radius: 12px;
      }

      .image-wrapper img {
        width: 100%;
        height: 500px;
        object-fit: cover;
      }

      .overlay-text {
        display: none;
      }

      /* Show mobile overlay */
      .mobile-overlay {
        display: block;
        position: absolute;
        top: 50%;
        left: 6%;
        transform: translateY(-50%);
        z-index: 2;
        width: 88%;
      }

      .mobile-title {
        font-family: 'Ade Display', serif;
        font-size: 2rem;
        line-height: 1.15;
        color: #ffffff;
        margin: 0;
        font-weight: 400;
        letter-spacing: 0.01em;
        text-shadow: 2px 2px 12px rgba(0, 0, 0, 0.5);
      }

      .mobile-description {
        font-family: 'Sofia Sans', sans-serif;
        margin-top: 16px;
        font-size: 0.95rem;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.6;
        font-weight: 500;
        text-shadow: 1px 1px 8px rgba(0, 0, 0, 0.5);
      }
    }

    @media (max-width: 480px) {
      .image-wrapper img {
        height: 400px;
      }

      .mobile-title {
        font-size: 1.75rem;
      }

      .mobile-description {
        font-size: 0.875rem;
        margin-top: 12px;
      }
    }
  `]
})
export class StaticSectionComponent {}
