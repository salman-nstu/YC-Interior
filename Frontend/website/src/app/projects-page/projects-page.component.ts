import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { ProjectService } from '../shared/services/project.service';
import { Project } from '../shared/models/project.model';
import { ApiResponse, PageResponse } from '../shared/models/api.model';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="projects-page">
      <div class="container">
        <h1 class="page-title">OUR<br>WORKS</h1>
        
        <div class="projects-grid" *ngIf="!loading && projects.length > 0">
          <div class="project-card" *ngFor="let project of projects" (click)="navigateToProject(project.id)">
            <div class="project-image">
              <img [src]="project.coverMedia?.url" [alt]="project.title" />
            </div>
            <div class="project-info">
              <h3 class="project-title">{{ project.title }}</h3>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div class="pagination" *ngIf="!loading && totalPages > 1">
          <button 
            class="pagination-btn" 
            [disabled]="currentPage === 0"
            (click)="goToPage(currentPage - 1)">
            ← Previous
          </button>
          
          <div class="pagination-numbers">
            <button 
              *ngFor="let page of getPageNumbers()" 
              class="page-number"
              [class.active]="page === currentPage"
              (click)="goToPage(page)">
              {{ page + 1 }}
            </button>
          </div>
          
          <button 
            class="pagination-btn" 
            [disabled]="currentPage === totalPages - 1"
            (click)="goToPage(currentPage + 1)">
            Next →
          </button>
        </div>
        
        <div class="loading-state" *ngIf="loading">
          <p>Loading projects...</p>
        </div>
        
        <div class="empty-state" *ngIf="!loading && projects.length === 0">
          <p>No projects available at the moment.</p>
        </div>
      </div>
    </div>
    
    <app-footer></app-footer>
  `,
  styles: [`
    .projects-page {
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

    .page-title {
      font-family: 'Ade', serif;
      font-size: 96px;
      font-weight: 400;
      color: #2C3E2F;
      margin-bottom: 60px;
      line-height: 1.1;
      letter-spacing: 2px;
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      margin-bottom: 60px;
    }

    .project-card {
      background-color: transparent;
      border-radius: 24px;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      }
    }

    .project-image {
      width: 100%;
      aspect-ratio: 4/3;
      overflow: hidden;
      position: relative;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
    }

    .project-card:hover .project-image img {
      transform: scale(1.05);
    }

    .project-info {
      background-color: white;
      padding: 20px;
      text-align: center;
    }

    .project-title {
      font-family: 'Sofia Sans', sans-serif;
      font-size: 18px;
      font-weight: 600;
      color: #2C3E2F;
      margin: 0;
      line-height: 1.3;
    }

    /* Pagination Styles */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 60px;
    }

    .pagination-btn {
      background-color: #46563B;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 15px;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      
      &:hover:not(:disabled) {
        background-color: #5a6e4a;
        transform: translateY(-2px);
      }
      
      &:disabled {
        background-color: #a0a0a0;
        cursor: not-allowed;
        opacity: 0.5;
      }
    }

    .pagination-numbers {
      display: flex;
      gap: 8px;
    }

    .page-number {
      width: 44px;
      height: 44px;
      border-radius: 6px;
      border: 2px solid #46563B;
      background-color: transparent;
      color: #46563B;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: #46563B;
        color: white;
      }
      
      &.active {
        background-color: #46563B;
        color: white;
      }
    }

    .loading-state,
    .empty-state {
      text-align: center;
      padding: 80px 20px;
      font-size: 18px;
      color: #2C3E2F;
    }

    @media (max-width: 1200px) {
      .projects-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 968px) {
      .container {
        padding: 0 40px;
      }

      .projects-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }

      .page-title {
        font-size: 64px;
      }

      .project-title {
        font-size: 16px;
      }
    }

    @media (max-width: 576px) {
      .projects-page {
        padding: 60px 0;
      }

      .container {
        padding: 0 20px;
      }

      .projects-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .page-title {
        font-size: 48px;
        margin-bottom: 40px;
      }

      .project-info {
        padding: 16px;
      }

      .project-title {
        font-size: 15px;
      }

      .pagination {
        flex-direction: column;
        gap: 12px;
      }

      .pagination-numbers {
        order: -1;
      }
    }
  `]
})
export class ProjectsPageComponent implements OnInit {
  projects: Project[] = [];
  loading = true;
  currentPage = 0;
  pageSize = 16;
  totalPages = 0;
  totalElements = 0;

  constructor(
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'auto' });
    this.loadProjects();
  }

  navigateToProject(projectId: number) {
    this.router.navigate(['/projects', projectId]);
  }

  loadProjects() {
    this.loading = true;
    this.projectService.getAllProjects(this.currentPage, this.pageSize).subscribe({
      next: (response: ApiResponse<PageResponse<Project>>) => {
        if (response.success && response.data) {
          this.projects = response.data.content;
          this.totalPages = response.data.totalPages;
          this.totalElements = response.data.totalElements;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading projects:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadProjects();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 0; i < this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show current page and surrounding pages
      let startPage = Math.max(0, this.currentPage - 2);
      let endPage = Math.min(this.totalPages - 1, this.currentPage + 2);
      
      // Adjust if at the beginning or end
      if (this.currentPage < 2) {
        endPage = Math.min(this.totalPages - 1, 4);
      } else if (this.currentPage > this.totalPages - 3) {
        startPage = Math.max(0, this.totalPages - 5);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }
}
