import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Project } from '../../../core/models/models';

@Component({
  selector: 'app-projects-list',
  template: `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Projects</h1>
          <p class="page-subtitle">Manage your portfolio projects</p>
        </div>
        <div class="flex gap-8">
          <button class="btn btn-outline btn-sm" routerLink="/projects/categories">📁 Categories</button>
          <button class="btn btn-primary" routerLink="/projects/new" id="add-project-btn">➕ New Project</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="card" style="margin-bottom:20px">
        <div class="card-body" style="display:flex;gap:12px;flex-wrap:wrap;padding:16px 20px">
          <div class="search-bar" style="flex:1;min-width:200px">
            <span class="search-icon">🔍</span>
            <input class="form-control" [(ngModel)]="keyword" (input)="onSearch()" placeholder="Search projects..." id="projects-search" />
          </div>
          <select class="form-select" [(ngModel)]="statusFilter" (change)="load()" style="width:140px" id="projects-status-filter">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <select class="form-select" [(ngModel)]="categoryFilter" (change)="load()" style="width:160px" id="projects-category-filter">
            <option value="">All Categories</option>
            <option *ngFor="let c of categories" [value]="c.id">{{c.name}}</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="card">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of projects">
                <td><img [src]="p.coverMedia?.url" class="thumb-sm" *ngIf="p.coverMedia" /></td>
                <td>
                  <p class="font-semibold" style="font-size:13px">{{p.title}}</p>
                  <p class="text-muted" style="font-size:11px">/{{p.slug}}</p>
                </td>
                <td><span class="badge badge-muted">{{p.category?.name || '—'}}</span></td>
                <td>
                  <span class="badge" [class.badge-success]="p.status==='published'" [class.badge-warning]="p.status==='draft'">
                    {{p.status}}
                  </span>
                </td>
                <td>
                  <button class="featured-toggle" [class.active]="p.isFeatured" (click)="toggleFeatured(p)" [id]="'featured-'+p.id">
                    {{p.isFeatured ? '⭐' : '☆'}}
                  </button>
                </td>
                <td class="text-muted" style="font-size:12px">{{p.createdAt | date:'mediumDate'}}</td>
                <td>
                  <div class="flex gap-8">
                    <button class="btn-icon" [routerLink]="['/projects/edit', p.id]" title="Edit" [id]="'edit-project-'+p.id">✏️</button>
                    <button class="btn-icon danger" (click)="confirmDelete(p)" title="Delete" [id]="'delete-project-'+p.id">🗑️</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="!projects.length">
                <td colspan="7" class="empty-state" style="padding:48px">
                  <div class="empty-icon">🏗️</div>
                  <p class="empty-title">No projects found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <app-pagination [totalPages]="totalPages" [currentPage]="page" (pageChange)="onPageChange($event)"></app-pagination>
      </div>

      <app-confirm-dialog [visible]="deleteVisible" title="Delete Project"
        message="This will soft-delete the project. Continue?"
        (confirmed)="deleteProject()" (cancelled)="deleteVisible=false">
      </app-confirm-dialog>
    </div>
  `,
  styles: [`
    .featured-toggle { background:none; border:none; font-size:20px; cursor:pointer; transition:transform 0.2s; padding:4px; border-radius:6px; }
    .featured-toggle:hover { transform:scale(1.3); }
    .featured-toggle.active { color:#F0A500; }
  `]
})
export class ProjectsListComponent implements OnInit {
  projects: Project[] = [];
  categories: any[] = [];
  keyword = ''; statusFilter = ''; categoryFilter = '';
  page = 0; totalPages = 0;
  deleteVisible = false; selectedProject: Project | null = null;
  private searchTimer: any;

  constructor(private api: ApiService, private toast: ToastService, public router: Router) {}

  ngOnInit() { this.loadCategories(); this.load(); }

  loadCategories() {
    this.api.getProjectCategoriesList().subscribe(res => this.categories = res.data || []);
  }

  load() {
    const catId = this.categoryFilter ? +this.categoryFilter : undefined;
    this.api.getProjects(this.keyword || undefined, this.statusFilter || undefined, catId, undefined, this.page).subscribe(res => {
      this.projects = res.data?.content || [];
      this.totalPages = res.data?.totalPages || 0;
    });
  }

  onSearch() { clearTimeout(this.searchTimer); this.searchTimer = setTimeout(() => { this.page = 0; this.load(); }, 400); }
  onPageChange(p: number) { this.page = p; this.load(); }

  toggleFeatured(p: Project) {
    this.api.setProjectFeatured(p.id, !p.isFeatured).subscribe({
      next: () => { p.isFeatured = !p.isFeatured; this.toast.success('Updated'); },
      error: err => this.toast.error(err.error?.message || 'Error')
    });
  }

  confirmDelete(p: Project) { this.selectedProject = p; this.deleteVisible = true; }

  deleteProject() {
    if (!this.selectedProject) return;
    this.api.deleteProject(this.selectedProject.id).subscribe({
      next: () => { this.toast.success('Deleted'); this.load(); },
      error: () => this.toast.error('Delete failed')
    });
  }
}
