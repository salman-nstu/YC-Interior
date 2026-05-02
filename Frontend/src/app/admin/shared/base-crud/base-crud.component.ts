import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil, finalize } from 'rxjs';
import { BaseTableComponent, TableColumn, TableAction, FilterOption } from '../base-table/base-table.component';
import { BaseCrudService } from '../../../core/services/base-crud.service';

@Component({
  selector: 'app-base-crud',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule,
    BaseTableComponent
  ],
  template: `
    <div class="page-header">
      <h1>{{ title }}</h1>
      <button mat-flat-button color="primary" (click)="openCreateForm()" *ngIf="canCreate">
        <mat-icon>add</mat-icon> {{ createButtonText }}
      </button>
    </div>

    <app-base-table
      [columns]="columns"
      [actions]="tableActions"
      [filters]="filters"
      [items]="items"
      [loading]="loading"
      [totalElements]="totalElements"
      [pageSize]="pageSize"
      [currentPage]="currentPage"
      [searchable]="searchable"
      [showFilters]="showFilters"
      [emptyMessage]="emptyMessage"
      [emptyIcon]="emptyIcon"
      (pageChange)="onPageChange($event)"
      (actionClick)="onActionClick($event)"
      (toggleChange)="onToggleChange($event)"
      (filterChange)="onFilterChange($event)">
    </app-base-table>

    <!-- Inline Form (if enabled) -->
    <div *ngIf="showInlineForm && formVisible" class="form-container">
      <div class="form-header">
        <h3>{{ isEditing ? 'Edit' : 'Create' }} {{ entityName }}</h3>
        <button mat-icon-button (click)="closeForm()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <form [formGroup]="form" (ngSubmit)="submitForm()">
        <ng-content select="[slot=form]"></ng-content>
        <div class="form-actions">
          <button mat-button type="button" (click)="closeForm()">Cancel</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || submitting">
            <mat-spinner diameter="20" *ngIf="submitting"></mat-spinner>
            {{ isEditing ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      
      h1 {
        font-size: 22px;
        font-weight: 600;
        color: var(--text);
        margin: 0;
      }
    }

    .form-container {
      background: var(--surface);
      border-radius: 12px;
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
      margin-top: 24px;
      overflow: hidden;
    }

    .form-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      border-bottom: 1px solid var(--border);
      background: var(--surface-alt);
      
      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: var(--text);
      }
    }

    form {
      padding: 24px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .form-full {
      grid-column: 1 / -1;
    }
  `]
})
export abstract class BaseCrudComponent<T extends { id?: number }, CreateRequest, UpdateRequest = CreateRequest> implements OnInit, OnDestroy {
  // Configuration properties (to be set by extending components)
  title = 'Items';
  entityName = 'Item';
  createButtonText = 'Add Item';
  emptyMessage = 'No items found';
  emptyIcon = 'inbox';
  
  // Table configuration
  columns: TableColumn[] = [];
  tableActions: TableAction[] = [
    { key: 'edit', label: 'Edit', icon: 'edit', color: 'primary', tooltip: 'Edit item' },
    { key: 'delete', label: 'Delete', icon: 'delete', color: 'warn', tooltip: 'Delete item' }
  ];
  filters: FilterOption[] = [];
  
  // Form configuration
  showInlineForm = true;
  canCreate = true;
  searchable = true;
  showFilters = true;
  
  // Data properties
  items: T[] = [];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  
  // State properties
  loading = false;
  submitting = false;
  formVisible = false;
  isEditing = false;
  editingItem: T | null = null;
  
  // Form
  form: FormGroup = new FormGroup({});
  
  // Filter values
  filterValues: any = {};
  
  // Services (to be injected by extending components)
  protected crudService!: BaseCrudService<T, CreateRequest, UpdateRequest>;
  
  private destroy$ = new Subject<void>();
  protected fb = inject(FormBuilder);
  protected snackBar = inject(MatSnackBar);
  protected dialog = inject(MatDialog);
  protected cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.initializeForm();
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Abstract methods (to be implemented by extending components)
  protected abstract initializeForm(): void;
  protected abstract buildCreateRequest(): CreateRequest;
  protected abstract buildUpdateRequest(): UpdateRequest;
  protected abstract populateForm(item: T): void;

  // Data loading
  loadData() {
    this.loading = true;
    const params = {
      ...this.filterValues,
      page: this.currentPage,
      size: this.pageSize
    };

    this.crudService.getAll(params)
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
            this.showError('Failed to load data');
          }
        },
        error: (error) => {
          console.error('Load error:', error);
          this.showError(error.error?.message || 'Failed to load data');
        }
      });
  }

  // Event handlers
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onActionClick(event: { action: string; item: T }) {
    switch (event.action) {
      case 'edit':
        this.editItem(event.item);
        break;
      case 'delete':
        this.deleteItem(event.item);
        break;
      default:
        this.handleCustomAction(event.action, event.item);
    }
  }

  onToggleChange(event: { item: T; field: string; value: boolean }) {
    this.handleToggleChange(event.item, event.field, event.value);
  }

  onFilterChange(filters: any) {
    this.filterValues = filters;
    this.currentPage = 0;
    this.loadData();
  }

  // CRUD operations
  openCreateForm() {
    this.isEditing = false;
    this.editingItem = null;
    this.form.reset();
    this.formVisible = true;
  }

  editItem(item: T) {
    this.isEditing = true;
    this.editingItem = item;
    this.populateForm(item);
    this.formVisible = true;
  }

  closeForm() {
    this.formVisible = false;
    this.isEditing = false;
    this.editingItem = null;
    this.form.reset();
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const operation = this.isEditing ? this.updateItem() : this.createItem();
    
    operation.pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.submitting = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccess(this.isEditing ? 'Item updated successfully' : 'Item created successfully');
          this.closeForm();
          this.loadData();
        } else {
          this.showError(response.message || 'Operation failed');
        }
      },
      error: (error) => {
        console.error('Submit error:', error);
        this.showError(error.error?.message || 'Operation failed');
      }
    });
  }

  private createItem() {
    const request = this.buildCreateRequest();
    return this.crudService.create(request);
  }

  private updateItem() {
    if (!this.editingItem?.id) {
      throw new Error('No item selected for editing');
    }
    const request = this.buildUpdateRequest();
    return this.crudService.update(this.editingItem.id, request);
  }

  deleteItem(item: T) {
    if (!item.id) {
      this.showError('Cannot delete item: ID not found');
      return;
    }

    this.crudService.delete(item.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.showSuccess('Item deleted successfully');
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

  // Custom handlers (can be overridden by extending components)
  protected handleCustomAction(action: string, item: T) {
    console.log('Custom action:', action, item);
  }

  protected handleToggleChange(item: T, field: string, value: boolean) {
    if (!item.id) return;
    
    if (field === 'featured') {
      this.crudService.setFeatured(item.id!, value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showSuccess(`Item ${value ? 'featured' : 'unfeatured'} successfully`);
            this.loadData();
          },
          error: (error) => {
            this.showError(error.error?.message || 'Update failed');
          }
        });
    }
  }

  // Utility methods
  protected showSuccess(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  protected showError(message: string) {
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }
}