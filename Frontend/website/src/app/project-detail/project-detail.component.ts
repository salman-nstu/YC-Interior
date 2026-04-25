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
          <!-- Top Section: Info and Cover Image -->
          <div class="project-header">
            <div class="project-info">
              <h1 class="project-title">{{ project.title }}</h1>
              
              <div class="project-category" *ngIf="project.categoryType">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ project.categoryType }}</span>
              </div>
              
              <div class="project-description">
                <p>{{ project.description }}</p>
              </div>
            </div>
            
            <div class="project-cover">
              <img [src]="project.coverMedia?.url" [alt]="project.title" />
            </div>
          </div>
          
          <!-- Additional Images Grid -->
          <div class="additional-images" *ngIf="project.images && project.images.length > 0">
            <div class="images-grid">
              <div class="image-item" *ngFor="let image of project.images">
                <img [src]="image.url" [alt]="image.altText || project.title" />
              </div>
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
    
    <app-footer></app-footer>
  `,
  styles: [`
    .project-detail-page {
      background-color: #D4D9C8;
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
      display: flex;
      flex-direction: column;
      gap: 60px;
    }

    /* Header Section */
    .project-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: start;
    }

    .project-info {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .project-title {
      font-family: 'Ade', serif;
      font-size: 48px;
      font-weight: 400;
      color: #2C3E2F;
      margin: 0;
      line-height: 1.2;
    }

    .project-category {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #5A6B5C;
      font-size: 18px;
      font-weight: 500;
      
      svg {
        color: #46563B;
      }
    }

    .project-description {
      margin-top: 20px;
      padding-left: 20px;
      border-left: 4px solid #B8C5A8;
      
      p {
        font-family: 'Sofia Sans', sans-serif;
        font-size: 17px;
        line-height: 1.8;
        color: #2d2d2d;
        margin: 0;
        white-space: pre-wrap;
      }
    }

    .project-cover {
      width: 100%;
      height: 100%;
      min-height: 400px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    /* Additional Images Grid */
    .additional-images {
      margin-top: 20px;
    }

    .images-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .image-item {
      aspect-ratio: 4/3;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }
      
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

      .project-header {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .project-title {
        font-size: 40px;
      }

      .images-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }
    }

    @media (max-width: 768px) {
      .project-detail-page {
        padding: 60px 0;
      }

      .container {
        padding: 0 20px;
      }

      .project-content {
        gap: 40px;
      }

      .project-title {
        font-size: 32px;
      }

      .project-category {
        font-size: 16px;
      }

      .project-description p {
        font-size: 15px;
      }

      .project-cover {
        min-height: 300px;
      }

      .images-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  `]
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  loading = true;
  projectId: number = 0;

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
}
