import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { ProjectService } from '../shared/services/project.service';
import { Project } from '../shared/models/project.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="project-detail-page">
      <div class="container">
        <div *ngIf="!loading && project" class="project-content">
          <!-- Masonry Grid Layout -->
          <div class="masonry-grid">
            <!-- First Card: Cover Photo -->
            <div class="grid-item cover-item" (click)="openLightbox(project.coverMedia?.url || '')">
              <img [src]="project.coverMedia?.url" [alt]="project.title" />
            </div>
            
            <!-- Second Card: Project Info -->
            <div class="grid-item info-item">
              <h1 class="project-title">{{ project.title }}</h1>
              
              <div class="project-meta">
                <div class="meta-item" *ngIf="project.categoryType">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ project.categoryType }}</span>
                </div>
              </div>
              
              <div class="project-description">
                <p>{{ project.description }}</p>
              </div>
            </div>
            
            <!-- Additional Images -->
            <div class="grid-item image-item" *ngFor="let image of project.images" (click)="openLightbox(image.url)">
              <img [src]="image.url" [alt]="image.altText || project.title" />
            </div>
          </div>
        </div>
        
        <div class="loading-state" *ngIf="loading">
          <p>Loading project details...</p>
        </div>
        
        <div class="error-state" *ngIf="!loading && !project">
          <p>Project not found.</p>
        </div>
      </div>
    </div>
    
    <!-- Lightbox Modal -->
    <div class="lightbox-overlay" *ngIf="lightboxOpen" (click)="closeLightbox()">
      <div class="lightbox-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="closeLightbox()">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <img [src]="currentLightboxImage" alt="Project image" />
      </div>
    </div>
    
    <app-footer></app-footer>
  `,
  styles: [`
    .project-detail-page {
      background-color: #E8E4D9;
      min-height: 100vh;
      padding: 80px 0;
      width: 100%;
      overflow-x: hidden;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 60px;
      width: 100%;
      box-sizing: border-box;
    }

    .project-content {
      width: 100%;
    }

    /* Masonry Grid Layout - Fixed Size Boxes */
    .masonry-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      grid-auto-rows: 280px;
    }

    .grid-item {
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
      height: 280px;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }
    }

    /* Cover Photo - Fixed size */
    .cover-item {
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    /* Info Card - Not clickable */
    .info-item {
      background-color: #B8C5A8;
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow-y: auto;
      cursor: default;
      
      &:hover {
        transform: none;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      }
    }

    .project-title {
      font-family: 'Ade', serif;
      font-size: 28px;
      font-weight: 400;
      color: #2C3E2F;
      margin: 0;
      line-height: 1.2;
    }

    .project-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #2C3E2F;
      font-family: 'Sofia Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      
      svg {
        color: #2C3E2F;
        flex-shrink: 0;
      }
    }

    .project-description {
      margin-top: 8px;
      
      p {
        font-family: 'Sofia Sans', sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: #2C3E2F;
        margin: 0;
        white-space: pre-wrap;
      }
    }

    /* Additional Images - Fixed sizes */
    .image-item {
      height: 280px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
      
      &:hover img {
        transform: scale(1.05);
      }
    }

    /* Lightbox Modal */
    .lightbox-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 20px;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .lightbox-content {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      align-items: center;
      justify-content: center;
      
      img {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
      }
    }

    .close-btn {
      position: absolute;
      top: -50px;
      right: 0;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 8px;
      transition: transform 0.2s ease;
      
      &:hover {
        transform: scale(1.1);
      }
      
      svg {
        display: block;
      }
    }

    .loading-state,
    .error-state {
      text-align: center;
      padding: 80px 20px;
      font-size: 18px;
      color: #2C3E2F;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .container {
        padding: 0 40px;
      }

      .masonry-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        grid-auto-rows: 250px;
      }

      .grid-item {
        height: 250px;
      }

      .info-item {
        padding: 24px;
      }

      .project-title {
        font-size: 24px;
      }

      .image-item {
        height: 250px;
      }
    }

    @media (max-width: 768px) {
      .project-detail-page {
        padding: 60px 0;
      }

      .container {
        padding: 0 20px;
      }

      .masonry-grid {
        grid-template-columns: 1fr;
        gap: 16px;
        grid-auto-rows: 220px;
      }

      .grid-item {
        height: 220px;
      }

      .info-item {
        padding: 20px;
      }

      .project-title {
        font-size: 22px;
      }

      .meta-item {
        font-size: 13px;
      }

      .project-description p {
        font-size: 13px;
      }

      .image-item {
        height: 220px;
      }

      .close-btn {
        top: -40px;
      }
    }
  `]
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  loading = true;
  projectId: number = 0;
  lightboxOpen = false;
  currentLightboxImage = '';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    // Get project ID from route params
    this.route.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.loadProject();
      }
    });
  }

  loadProject() {
    this.loading = true;
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.project = response.data;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openLightbox(imageUrl: string) {
    this.currentLightboxImage = imageUrl;
    this.lightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightboxOpen = false;
    document.body.style.overflow = '';
  }
}
