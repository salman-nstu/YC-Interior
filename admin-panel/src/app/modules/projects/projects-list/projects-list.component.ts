import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil, finalize } from 'rxjs';
import { DataTableComponent, TableColumn, TableAction, FilterOption } from '../../../shared/data-table/data-table.component';
import { ProjectService } from '../../../core/services/project.service';
import { ProjectResponse, ProjectCategory } from '../../../core/models/project.model';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    DataTableComponent
  ],
  template: `
    <app-data-table
      title="Projects"
      createButtonText="New Project"
      [columns]="columns"
      [actions]="actions"
      [filters]="filters"
      [items]="items"
      [loading]="loading"
      [totalElements]="totalElements"
      [pageSize]="pageSize"
      [currentPage]="currentPage"
      emptyMessage="No projects found"
      emptyIcon="business"
      (pageChange)="onPageChange($event)"
      (actionClick)="onActionClick($event)"
      (toggleChange)="onToggleChange($event)"
      (filterChange)="onFilterChange($event)"
      (createClick)="navigateToCreate()">
    </app-data-table>
  `
})
export class ProjectsListComponent implements OnInit {
  private projectService = inject(ProjectService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  categories: ProjectCategory[] = [];

  columns: TableColumn[] = [
    {
      key: 'coverMedia.url',
      label: 'Cover',
      type: 'image',
      width: '80px',
      imageProperty: 'coverMedia.url'
    },
    {
      key: 'title',
      label: 'Title',
      type: 'text'
    },
    {
      key: 'category.name',
      label: 'Category',
      type: 'text'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      badgeConfig: {
        'published': { class: 'published', label: 'Published' },
        'draft': { class: 'draft', label: 'Draft' }
      }
    },
    {
      key: 'featured',
      label: 'Featured',
      type: 'toggle'
    },
    {
      key: 'createdAt',
      label: 'Created',
      type: 'date'
    }
  ];

  actions: TableAction[] = [
    { key: 'edit', label: 'Edit', icon: 'edit', color: 'primary', tooltip: 'Edit project' },
    { key: 'delete', label: 'Delete', icon: 'delete', color: 'warn', tooltip: 'Delete project' }
  ];

  filters: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'published', label: 'Published' },
        { value: 'draft', label: 'Draft' }
      ]
    },
    {
      key: 'categoryId',
      label: 'Category',
      type: 'select',
      options: []
    },
    {
      key: 'featured',
      label: 'Featured',
      type: 'select',
      options: [
        { value: true, label: 'Featured' },
        { value: false, label: 'Not Featured' }
      ]
    }
  ];

  // Data properties
  items: ProjectResponse[] = [];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  loading = false;
  filterValues: any = {};

  ngOnInit() {
    this.loadCategories();
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCategories() {
    this.projectService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data;
          const categoryFilter = this.filters.find(f => f.key === 'categoryId');
          if (categoryFilter) {
            categoryFilter.options = this.categories.map(cat => ({
              value: cat.id,
              label: cat.name
            }));
          }
        }
      },
      error: (error) => {
        console.error('Failed to load categories:', error);
      }
    });
  }

  loadData() {
    this.loading = true;
    const params = {
      ...this.filterValues,
      page: this.currentPage,
      size: this.pageSize
    };

    this.projectService.getAll(params)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.items = response.data.content;
            this.totalElements = response.data.totalElements;
          } else {
            this.showError('Failed to load projects');
          }
        },
        error: (error) => {
          console.error('Load error:', error);
          this.showError(error.error?.message || 'Failed to load projects');
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onActionClick(event: { action: string; item: ProjectResponse }) {
    switch (event.action) {
      case 'edit':
        window.location.href = `/projects/${event.item.id}/edit`;
        break;
      case 'delete':
        this.deleteItem(event.item);
        break;
    }
  }

  onToggleChange(event: { item: ProjectResponse; field: string; value: boolean }) {
    if (event.field === 'featured') {
      this.projectService.setFeatured(event.item.id!, event.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showSuccess(`Project ${event.value ? 'featured' : 'unfeatured'} successfully`);
            this.loadData();
          },
          error: (error) => {
            this.showError(error.error?.message || 'Update failed');
          }
        });
    }
  }

  onFilterChange(filters: any) {
    this.filterValues = filters;
    this.currentPage = 0;
    this.loadData();
  }

  navigateToCreate() {
    window.location.href = '/projects/new';
  }

  deleteItem(item: ProjectResponse) {
    this.projectService.delete(item.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.showSuccess('Project deleted successfully');
            this.loadData();
          } else {
            this.showError(response.message || 'Delete failed');
          }
        },
        error: (error) => {
          console.error('Delete error:', error);
          this.showError(error.error?.message || 'Delete failed');
        }
      });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }
}