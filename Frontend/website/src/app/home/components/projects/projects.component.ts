import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectService } from '../../../shared/services/project.service';
import { Project } from '../../../shared/models/project.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="projects-section" id="projects">
      <div class="container">
        <h2 class="section-title">OUR<br>WORKS</h2>
        
        <div class="projects-grid" *ngIf="displayProjects.length > 0">
          <!-- Show projects when loaded -->
          <div class="project-card" *ngFor="let project of displayProjects" (click)="navigateToProject(project.id)">
            <div class="project-image-wrapper">
              <img 
                [src]="getProjectImage(project)" 
                [alt]="project.title"
                class="project-image"
              />
            </div>
            <div class="project-name">{{ project.title }}</div>
          </div>
        </div>

        <div *ngIf="displayProjects.length === 0 && !loading" class="no-projects">
          <p>No projects available</p>
        </div>

        <div *ngIf="loading" class="loading">
          <p>Loading projects...</p>
        </div>
        
        <div class="view-all-wrapper">
          <button class="btn-view-all" (click)="navigateToProjects()">view all →</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .projects-section {
      padding: 5rem 0;
      background-color: #FFFFFF;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 3rem 2rem;
      border: 2px solid #2d2d2d;
      border-radius: 24px;
    }

    .section-title {
      font-family: 'Ade', serif;
      font-size: 96px;
      font-weight: 400;
      font-style: normal;
      line-height: 100%;
      letter-spacing: 0%;
      color: #46563B;
      margin: 0 0 3rem 0;
      width: 482.49px;
      height: 190.94px;
      transform: rotate(0.31deg);
      opacity: 1;
      margin-left: calc((100% - (289px * 4 + 1.5rem * 3)) / 2);
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(4, 289px);
      gap: 1.5rem;
      margin-bottom: 3rem;
      justify-content: center;
    }

    .project-card {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: transform 0.3s ease;
      background-color: #CFD0AE;
      border-radius: 12px;
      padding: 9px;
      width: 289px;
      height: 418px;
      
      &:hover {
        transform: translateY(-8px);
      }
    }

    .project-image-wrapper {
      width: 271px;
      height: 342px;
      border-radius: 8px;
      overflow: hidden;
      background-color: #e5e5e5;
      margin-bottom: 1rem;
      flex-shrink: 0;
    }

    .project-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .project-card:hover .project-image {
      transform: scale(1.05);
    }

    .project-name {
      text-align: center;
      font-family: 'Sofia Sans', sans-serif;
      font-size: 20px;
      font-weight: 500;
      font-style: normal;
      line-height: 100%;
      letter-spacing: 0%;
      color: #2d2d2d;
      padding: 0.5rem;
    }

    .view-all-wrapper {
      text-align: center;
      margin-top: 1rem;
    }

    .btn-view-all {
      background-color: #144F3C;
      color: #ffffff;
      border: none;
      padding: 0.875rem 2.25rem;
      font-size: 0.9375rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      letter-spacing: 0.025em;
      transition: all 0.3s ease;
      text-transform: lowercase;
      
      &:hover {
        background-color: #0d3a2a;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(20, 79, 60, 0.3);
      }
    }

    .no-projects, .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
      font-size: 1.125rem;
    }

    @media (max-width: 1200px) {
      .projects-grid {
        grid-template-columns: repeat(2, 289px);
      }
      
      .section-title {
        font-size: 4rem;
        margin-left: calc((100% - (289px * 2 + 1.5rem)) / 2);
      }
    }

    @media (max-width: 768px) {
      .projects-section {
        padding: 3rem 0;
      }
      
      .projects-grid {
        grid-template-columns: 289px;
        gap: 1.5rem;
      }
      
      .section-title {
        font-size: 3rem;
        margin-bottom: 2rem;
        margin-left: calc((100% - 289px) / 2);
      }
      
      .container {
        padding: 2rem 1rem;
      }
    }
  `]
})
export class ProjectsComponent implements OnInit {
  displayProjects: Project[] = [];
  loading = true;

  constructor(
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.projectService.getFeaturedProjects().subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.loading = false;
        if (response.success && response.data?.content) {
          this.displayProjects = [...response.data.content.slice(0, 4)];
          console.log('Display projects set to:', this.displayProjects);
          console.log('Display projects length:', this.displayProjects.length);
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  navigateToProjects() {
    this.router.navigate(['/projects']);
  }

  navigateToProject(projectId: number) {
    this.router.navigate(['/projects', projectId]);
  }

  getProjectImage(project: Project): string {
    console.log('Project:', project.title, 'coverMedia:', project.coverMedia, 'coverMediaId:', project.coverMediaId);
    
    if (project.coverMedia?.url) {
      // Check if URL is already absolute (starts with http:// or https://)
      if (project.coverMedia.url.startsWith('http://') || project.coverMedia.url.startsWith('https://')) {
        console.log('Using absolute coverMedia URL:', project.coverMedia.url);
        return project.coverMedia.url;
      }
      
      // Otherwise, construct relative URL
      const fullUrl = `${environment.fileBaseUrl}${project.coverMedia.url}`;
      console.log('Using relative coverMedia URL:', fullUrl);
      return fullUrl;
    }
    
    // Fallback to a placeholder image service
    console.log('Using placeholder image for:', project.title);
    return 'https://via.placeholder.com/400x300/4a5d4f/ffffff?text=' + encodeURIComponent(project.title);
  }
}
