import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil, finalize } from 'rxjs';
import { DataTableComponent, TableColumn, TableAction, FilterOption } from '../../../shared/data-table/data-table.component';
import { ServiceService } from '../../../core/services/service.service';
import { ServiceResponse, ServiceRequest } from '../../../core/models/service.model';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    DataTableComponent
  ],
  template: `
    <app-data-table
      title="Services"
      createButtonText="New Service"
      [columns]="columns"
      [actions]="actions"
      [filters]="filters"
      [items]="items"
      [loading]="loading"
      [totalElements]="totalElements"
      [pageSize]="pageSize"
      [currentPage]="currentPage"
      emptyMessage="No services found"
      emptyIcon="design_services"
      (pageChange)="onPageChange($event)"
      (actionClick)="onActionClick($event)"
      (toggleChange)="onToggleChange($event)"
      (filterChange)="onFilterChange($event)"
      (createClick)="navigateToCreate()">
    </app-data-table>
  `
})
export class ServicesListComponent implements OnInit {
  private serviceService = inject(ServiceService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

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
      key: 'status',
      label: 'Status',
      type: 'badge',
      badgeConfig: {
        'published': { class: 'published', label: 'Published' },
        'draft': { class: 'draft', label: 'Draft' }
      }
    },
    {
      key: 'displayOrder',
      label: 'Order',
      type: 'number'
    },
    {
      key: 'createdAt',
      label: 'Created',
      type: 'date'
    }
  ];

  actions: TableAction[] = [
    { key: 'edit', label: 'Edit', icon: 'edit', color: 'primary', tooltip: 'Edit service' },
    { key: 'delete', label: 'Delete', icon: 'delete', color: 'warn', tooltip: 'Delete service' }
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
    }
  ];

  // Data properties
  items: ServiceResponse[] = [];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  loading = false;
  filterValues: any = {};

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    this.loading = true;
    const params = {
      ...this.filterValues,
      page: this.currentPage,
      size: this.pageSize
    };

    this.serviceService.getAll(params)
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
            this.showError('Failed to load services');
          }
        },
        error: (error) => {
          console.error('Load error:', error);
          this.showError(error.error?.message || 'Failed to load services');
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onActionClick(event: { action: string; item: ServiceResponse }) {
    switch (event.action) {
      case 'edit':
        window.location.href = `/services/${event.item.id}/edit`;
        break;
      case 'delete':
        this.deleteItem(event.item);
        break;
    }
  }

  onToggleChange(event: { item: ServiceResponse; field: string; value: boolean }) {
    // Handle toggle changes if needed
  }

  onFilterChange(filters: any) {
    this.filterValues = filters;
    this.currentPage = 0;
    this.loadData();
  }

  navigateToCreate() {
    window.location.href = '/services/new';
  }

  deleteItem(item: ServiceResponse) {
    this.serviceService.delete(item.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.showSuccess('Service deleted successfully');
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