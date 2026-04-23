import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
        <div class="projects-container">
          <h2 class="section-title">OUR<br>WORKS</h2>
          
          <div class="projects-grid" *ngIf="projects.length > 0">
            <div class="project-card" *ngFor="let project of projects.slice(0, 4)">
              <div class="project-image">
                <img 
                  [src]="project.coverImageUrl ? environment.fileBaseUrl + project.coverImageUrl : '/yc-assets/don-kaveen-NFbwes_e-jI-unsplash.jpg'" 
                  [alt]="project.title"
                />
              </div>
              <h3 class="project-title">{{ project.title }}</h3>
            </div>
          </div>
          
          <div class="empty-state" *ngIf="projects.length === 0 && !loading">
            <div class="project-card placeholder" *ngFor="let i of [1,2,3,4]">
              <div class="project-image">
                <img [src]="getPlaceholderImage(i-1)" alt="Project" />
              </div>
              <h3 class="project-title">Project {{ i }}</h3>
            </div>
          </div>
          
          <div class="view-all-btn">
            <button class="btn-primary">view all →</button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .projects-section {
      padding: var(--spacing-xl) 0;
      background-color: var(--color-cream);
    }

    .projects-container {
      border: 3px solid var(--color-text-dark);
      border-radius: 24px;
      padding: 3rem;
      background-color: var(--color-white);
    }

    .section-title {
      font-size: 4rem;
      margin: 0 0 3rem 0;
      color: var(--color-text-dark);
      line-height: 1.1;
      font-weight: 300;
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .empty-state {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .project-card {
      background: var(--color-beige-light);
      border-radius: var(--radius-lg);
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-lg);
      }
      
      .project-image {
        height: 250px;
        overflow: hidden;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
      }
      
      &:hover .project-image img {
        transform: scale(1.1);
      }
      
      .project-title {
        padding: 1.5rem;
        text-align: center;
        font-size: 0.95rem;
        color: var(--color-text-dark);
        font-family: var(--font-body);
        font-weight: 400;
      }
    }

    .view-all-btn {
      text-align: center;
      margin-top: 1rem;
    }

    @media (max-width: 1200px) {
      .projects-grid,
      .empty-state {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .projects-grid,
      .empty-state {
        grid-template-columns: 1fr;
      }
      
      .section-title {
        font-size: 2.5rem;
      }
      
      .projects-container {
        padding: 2rem 1.5rem;
      }
    }
  `]
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  loading = false;
  environment = environment;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loading = true;
    this.projectService.getFeaturedProjects().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.projects = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
      }
    });
  }

  getPlaceholderImage(index: number): string {
    const placeholders = [
      '/yc-assets/pexels-athena-2962066.jpg',
      '/yc-assets/pexels-iremonat-14564071.jpg',
      '/yc-assets/don-kaveen-NFbwes_e-jI-unsplash.jpg',
      '/yc-assets/jason-briscoe-AQl-J19ocWE-unsplash.jpg'
    ];
    return placeholders[index % placeholders.length];
  }
}
