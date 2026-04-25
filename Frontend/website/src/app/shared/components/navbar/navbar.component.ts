import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { SettingsService } from '../../services/settings.service';
import { ApplicationSettings } from '../../models/settings.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="container nav-content">
        <div class="logo">
          <a routerLink="/" (click)="scrollToTop()">
            <div class="logo-icon">
              <img 
                *ngIf="settings?.logoMedia?.url" 
                [src]="settings?.logoMedia?.url" 
                [alt]="settings?.siteName || 'Logo'"
              />
              <svg *ngIf="!settings?.logoMedia?.url" width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="19" stroke="currentColor" stroke-width="2"/>
                <text x="20" y="26" text-anchor="middle" font-size="16" font-weight="600" fill="currentColor">YC</text>
              </svg>
            </div>
          </a>
        </div>
        
        <!-- Hamburger Menu Button -->
        <button class="hamburger" (click)="toggleMenu()" [class.active]="isMenuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <!-- Navigation Links -->
        <ul class="nav-links" [class.mobile-open]="isMenuOpen">
          <li><a (click)="navigateToHome($event); closeMenu()" [class.active]="currentRoute === '/' && activeSection === 'home'">HOME</a></li>
          <li><a routerLink="/about" (click)="closeMenu()" [class.active]="currentRoute === '/about'">ABOUT</a></li>
          <li><a routerLink="/services" (click)="closeMenu()" [class.active]="currentRoute === '/services'">SERVICES</a></li>
          <li><a routerLink="/projects" (click)="closeMenu()" [class.active]="currentRoute === '/projects'">PROJECTS</a></li>
          <li><a routerLink="/team" (click)="closeMenu()" [class.active]="currentRoute === '/team'">TEAM</a></li>
          <li><a routerLink="/blogs" (click)="closeMenu()" [class.active]="currentRoute === '/blogs' || currentRoute.startsWith('/blogs/')">BLOGS</a></li>
          <li><a routerLink="/contact" (click)="closeMenu()" [class.active]="currentRoute === '/contact'">CONTACT</a></li>
        </ul>
      </div>
      
      <!-- Mobile Menu Overlay -->
      <div class="menu-overlay" [class.active]="isMenuOpen" (click)="closeMenu()"></div>
    </nav>
  `,
  styles: [`
    .navbar {
      padding: 1.5rem 0;
      background: #EAE8DC;
      position: relative;
      width: 100%;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 60px;
      width: 100%;
      box-sizing: border-box;
    }

    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      z-index: 102;
      
      a {
        text-decoration: none;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      
      .logo-icon {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        svg {
          color: var(--color-primary-dark);
        }
      }
    }

    /* Hamburger Menu */
    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: space-around;
      width: 30px;
      height: 25px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      z-index: 102;
      
      span {
        width: 100%;
        height: 3px;
        background-color: var(--color-primary-dark);
        border-radius: 10px;
        transition: all 0.3s ease;
        transform-origin: center;
      }
      
      &.active {
        span:nth-child(1) {
          transform: rotate(45deg) translateY(10px);
        }
        
        span:nth-child(2) {
          opacity: 0;
        }
        
        span:nth-child(3) {
          transform: rotate(-45deg) translateY(-10px);
        }
      }
    }

    /* Menu Overlay */
    .menu-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 99;
      opacity: 0;
      transition: opacity 0.3s ease;
      
      &.active {
        opacity: 1;
      }
    }

    .nav-links {
      display: flex;
      gap: 3rem;
      list-style: none;
      align-items: center;
      margin: 0;
      padding: 0;
      
      a {
        font-size: 0.9rem;
        font-weight: 500;
        letter-spacing: 0.5px;
        color: var(--color-text-dark);
        transition: color 0.3s;
        text-transform: uppercase;
        text-decoration: none;
        cursor: pointer;
        
        &:hover {
          color: var(--color-primary);
        }

        &.active {
          color: var(--color-primary);
          font-weight: 600;
        }
      }
      
      li {
        position: relative;
        
        &::before {
          content: '•';
          position: absolute;
          left: -1.5rem;
          color: var(--color-text-dark);
          opacity: 0.5;
        }
        
        &:first-child::before {
          display: none;
        }
      }
    }

    @media (max-width: 768px) {
      .container {
        padding: 0 20px;
      }

      .hamburger {
        display: flex;
      }

      .menu-overlay {
        display: block;
        
        &:not(.active) {
          pointer-events: none;
        }
      }

      .nav-links {
        position: fixed;
        top: 0;
        right: -100%;
        width: 280px;
        height: 100vh;
        background: #EAE8DC;
        flex-direction: column;
        justify-content: flex-start;
        padding: 100px 30px 30px;
        gap: 0;
        box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
        transition: right 0.3s ease;
        z-index: 101;
        overflow-y: auto;
        
        &.mobile-open {
          right: 0;
        }
        
        li {
          width: 100%;
          padding: 0;
          margin: 0;
          
          &::before {
            display: none;
          }
          
          a {
            display: block;
            width: 100%;
            padding: 15px 0;
            font-size: 1rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  settings: ApplicationSettings | null = null;
  currentRoute: string = '/';
  activeSection: string = 'home';
  isMenuOpen: boolean = false;

  constructor(
    private settingsService: SettingsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  @HostListener('window:scroll')
  onWindowScroll() {
    if (this.currentRoute === '/') {
      this.updateActiveSection();
    }
  }

  ngOnInit() {
    this.loadSettings();
    this.currentRoute = this.router.url.split('#')[0].split('?')[0];
    
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects.split('#')[0].split('?')[0];
      if (this.currentRoute === '/') {
        setTimeout(() => this.updateActiveSection(), 100);
      }
      this.cdr.detectChanges();
    });

    // Initial active section update
    if (this.currentRoute === '/') {
      setTimeout(() => this.updateActiveSection(), 100);
    }
  }

  loadSettings() {
    this.settingsService.getSettings().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.settings = response.data;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error loading settings:', error);
      }
    });
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  navigateToHome(event: Event) {
    event.preventDefault();
    
    if (this.currentRoute === '/') {
      // Already on home page, just scroll to top
      this.scrollToTop();
    } else {
      // Navigate to home page
      this.router.navigate(['/']).then(() => {
        this.scrollToTop();
      });
    }
  }

  navigateToSection(event: Event, sectionId: string) {
    event.preventDefault();
    
    if (this.currentRoute === '/') {
      // Already on home page, just scroll to section
      this.scrollToSection(sectionId);
    } else {
      // Navigate to home page first, then scroll to section
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          this.scrollToSection(sectionId);
        }, 100);
      });
    }
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80; // Approximate navbar height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  updateActiveSection() {
    const sections = ['home', 'about', 'projects', 'services', 'contact'];
    const scrollPosition = window.pageYOffset + 150; // Offset for navbar

    // If at the very top, set home as active
    if (window.pageYOffset < 100) {
      if (this.activeSection !== 'home') {
        this.activeSection = 'home';
        this.cdr.detectChanges();
      }
      return;
    }

    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);
      if (element) {
        const offsetTop = element.offsetTop;
        const offsetBottom = offsetTop + element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          if (this.activeSection !== sectionId) {
            this.activeSection = sectionId;
            this.cdr.detectChanges();
          }
          break;
        }
      }
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    // Prevent body scroll when menu is open
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }
}
