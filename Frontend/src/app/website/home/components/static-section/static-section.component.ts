import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-static-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section #sectionRef class="static-section">
      <div class="content-overlay">
        <div class="container">
          <h2 class="section-title">
            <span class="title-line split-text">Discover Styles</span>
            <span class="title-line split-text">That Match</span>
            <span class="title-line split-text">Your Personality</span>
          </h2>
          <p class="section-description fade-up">
            Modern interior design and construction solutions tailored to your lifestyle.
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .static-section {
      min-height: clamp(500px, 70vh, 700px);
      width: 100%;
      background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)),
                  url('/yc-assets/Download_Y.jpg') center/cover no-repeat;
      display: flex;
      flex-direction: column;
      color: #ffffff;
      position: relative;
      overflow: hidden;
      margin: -10px 0 0 0 !important;
      padding: 0 !important;
    }

    /* CONTENT OVERLAY */
    .content-overlay {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      width: 100%;
      padding: clamp(40px, 8vw, 80px) 0;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 clamp(30px, 5vw, 80px);
      width: 100%;
    }

    /* TYPOGRAPHY */
    .section-title {
      font-family: 'Ade Display', serif;
      font-size: clamp(3rem, 7vw, 6rem);
      line-height: 1.1;
      font-weight: 400;
      color: #fff;
      margin-bottom: clamp(30px, 4vw, 50px);
      text-align: left;
    }

    .title-line {
      display: block;
      overflow: hidden;
      margin-bottom: 0.1em;
    }

    /* Split text animation setup */
    .split-text .char {
      display: inline-block;
      transform-origin: bottom;
    }

    .section-description {
      font-family: 'Sofia Sans', sans-serif;
      font-size: clamp(1rem, 1.3vw, 1.2rem);
      line-height: 1.8;
      color: #e0e0e0;
      max-width: 500px;
      font-weight: 400;
      text-align: left;
    }

    /* MOBILE */
    @media (max-width: 768px) {
      .static-section {
        min-height: clamp(600px, 80vh, 800px);
      }

      .section-title {
        font-size: clamp(2.5rem, 10vw, 4rem);
      }

      .section-description {
        max-width: 100%;
        font-size: 1rem;
      }
    }

    @media (max-width: 480px) {
      .container {
        padding: 0 20px;
      }

      .section-title {
        font-size: 2.5rem;
      }
    }
  `]
})
export class StaticSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sectionRef') section!: ElementRef;

  private scrollTriggers: ScrollTrigger[] = [];

  ngAfterViewInit() {
    this.initAnimations();
  }

  ngOnDestroy() {
    // Clean up ScrollTriggers
    this.scrollTriggers.forEach(trigger => trigger.kill());
  }

  initAnimations() {
    /* 🔠 Split Text for each line */
    const titleLines = document.querySelectorAll('.title-line');
    
    titleLines.forEach((line) => {
      new SplitType(line as HTMLElement, { types: 'chars' });
    });

    /* 🎬 Master Timeline */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.section.nativeElement,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });

    // Store ScrollTrigger for cleanup
    if (tl.scrollTrigger) {
      this.scrollTriggers.push(tl.scrollTrigger);
    }

    /* ✨ Title Animation (Luxury stagger per line) */
    titleLines.forEach((line, index) => {
      const chars = line.querySelectorAll('.char');
      tl.from(chars, {
        y: 120,
        opacity: 0,
        rotateX: -90,
        stagger: 0.03,
        duration: 1.2,
        ease: 'power4.out'
      }, index === 0 ? 0 : '-=0.8'); // Overlap animations
    });

    /* 📝 Description fade */
    tl.from('.fade-up', {
      y: 40,
      opacity: 0,
      duration: 0.8
    }, '-=0.6');
  }
}
