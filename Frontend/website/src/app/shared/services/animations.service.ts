import { Injectable } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

@Injectable({
  providedIn: 'root'
})
export class AnimationsService {

  constructor() {}

  // HERO ANIMATIONS - Cinematic entrance
  initHeroAnimations() {
    // Check if elements exist
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const btnPrimary = document.querySelector('.btn-primary');
    
    if (!heroTitle || !heroSubtitle || !btnPrimary) {
      console.warn('Hero elements not found for animation');
      return;
    }

    const tl = gsap.timeline();
    
    // Set initial states
    gsap.set('.hero-title', { y: 80, opacity: 0 });
    gsap.set('.hero-subtitle', { y: 40, opacity: 0 });
    gsap.set('.btn-primary', { y: 30, opacity: 0 });
    
    // Background zoom effect
    gsap.fromTo('.hero', 
      { scale: 1.1 }, 
      { 
        scale: 1, 
        duration: 2, 
        ease: 'power3.out' 
      }
    );

    // Title stagger animation
    tl.to('.hero-title', {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power4.out'
    });

    tl.to('.hero-subtitle', {
      y: 0,
      opacity: 1,
      duration: 1,
    }, "-=0.8");

    tl.to('.btn-primary', {
      y: 0,
      opacity: 1,
      duration: 0.8,
    }, "-=0.6");
    
    console.log('Hero animations initialized');
  }

  // FADE UP ANIMATION - Reusable for sections
  fadeUp(selector: string, trigger: string, stagger: number = 0) {
    const config: any = {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger,
        start: 'top 80%',
      }
    };

    if (stagger > 0) {
      config.stagger = stagger;
    }

    gsap.from(selector, config);
  }

  // SERVICES GRID ANIMATION - Preserves zigzag design
  initServicesAnimation() {
    // Store original transforms (zigzag positioning)
    const cards = document.querySelectorAll('.service-card');
    const originalTransforms: string[] = [];
    
    cards.forEach((card, index) => {
      const computedStyle = getComputedStyle(card);
      originalTransforms[index] = computedStyle.transform;
    });

    // Set initial animation state (hidden + moved down)
    gsap.set('.service-card', {
      opacity: 0,
      y: '+=80' // Add 80px to existing transform
    });

    // Animate to visible state while preserving zigzag
    gsap.to('.service-card', {
      opacity: 1,
      y: '-=80', // Remove the 80px we added, keeping original zigzag
      stagger: 0.2,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.services-section',
        start: 'top 80%',
      }
    });
  }

  // GALLERY ANIMATION
  initGalleryAnimation() {
    gsap.from('.gallery-item', {
      scale: 0.9,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      scrollTrigger: {
        trigger: '.gallery-section',
        start: 'top 85%',
      }
    });
  }

  // STATS FLOATING ANIMATION
  initStatsAnimation() {
    // Initial fade in
    gsap.from('.stat-card', {
      y: 60,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      scrollTrigger: {
        trigger: '.stats-section',
        start: 'top 80%',
      }
    });

    // Floating effect loop
    gsap.to('.stat-card', {
      y: -15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.3,
      delay: 1 // Start after fade in
    });
  }

  // CLIENTS CAROUSEL ANIMATION
  initClientsAnimation() {
    const clientsTrack = document.querySelector('.clients-logos');
    if (clientsTrack) {
      const tl = gsap.to('.clients-logos', {
        xPercent: -50,
        duration: 20,
        ease: 'linear',
        repeat: -1
      });

      // Pause on hover
      clientsTrack.addEventListener('mouseenter', () => tl.pause());
      clientsTrack.addEventListener('mouseleave', () => tl.resume());
    }
  }

  // REVIEWS ANIMATION
  initReviewsAnimation() {
    gsap.from('.review-card', {
      x: 100,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.reviews-section',
        start: 'top 80%',
      }
    });
  }

  // ABOUT SECTION ANIMATION
  initAboutAnimation() {
    gsap.from('.about-text p', {
      y: 60,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 80%',
      }
    });
  }

  // FAQ ANIMATION
  initFaqAnimation() {
    gsap.from('.faq-item', {
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.faq-section',
        start: 'top 85%',
      }
    });
  }

  // STATIC SECTION (DISCOVER STYLES) ANIMATION
  initStaticSectionAnimation() {
    // Split text reveal
    gsap.from('.line', {
      y: 100,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      scrollTrigger: {
        trigger: '.static-section',
        start: 'top 80%',
      }
    });

    // Image parallax
    gsap.to('.image-wrapper img', {
      y: 50,
      scrollTrigger: {
        trigger: '.static-section',
        scrub: true,
      }
    });
  }

  // UTILITY: Refresh ScrollTrigger (call after dynamic content loads)
  refreshScrollTrigger() {
    ScrollTrigger.refresh();
  }

  // UTILITY: Kill all animations (cleanup)
  killAllAnimations() {
    gsap.killTweensOf("*");
    ScrollTrigger.killAll();
  }
}