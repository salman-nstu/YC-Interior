import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { BaseCrudService } from '../../core/services/base-crud.service';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'image' | 'badge' | 'toggle' | 'actions' | 'date' | 'number';
  sortable?: boolean;
  width?: string;
  imageProperty?: string; // For image columns, which property contains the image URL
  badgeConfig?: { [key: string]: { class: string; label?: string } }; // For badge styling
}

export interface TableAction {
  key: string;
  label: string;
  icon: string;
  color?: 'primary' | 'accent' | 'warn';
  tooltip?: string;
}

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'text';
  options?: { value: any; label: string }[];
  placeholder?: string;
}

@Component({
  selector: 'app-base-table',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatPaginatorModule, MatProgressSpinnerModule,
    MatSlideToggleModule, MatTooltipModule
  ],
  template: `
    <div class="table-container">
      <!-- Filter Bar -->
      <div class="filter-bar" *ngIf="showFilters">
        <!-- Search -->
        <mat-form-field appearance="outline" *ngIf="searchable">
          <mat-label>Search</mat-label>
          <input matInput [(ngModel)]="searchTerm" placeholder="Search...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <!-- Additional Filters -->
        <mat-form-field appearance="outline" *ngFor="let filter of filters" [style.max-width]="filter.type === 'select' ? '160px' : '200px'">
          <mat-label>{{ filter.label }}</mat-label>
          <mat-select *ngIf="filter.type === 'select'" [(ngModel)]="filterValues[filter.key]" (ngModelChange)="onFilterChange()">
            <mat-option value="">All</mat-option>
            <mat-option *ngFor="let option of filter.options" [value]="option.value">
              {{ option.label }}
            </mat-option>
          </mat-select>
          <input *ngIf="filter.type === 'text'" matInput [(ngModel)]="filterValues[filter.key]" [placeholder]="filter.placeholder || ''">
        </mat-form-field>
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <!-- Data Table -->
      <table mat-table [dataSource]="items" *ngIf="!loading" class="data-table">
        <!-- Dynamic Columns -->
        <ng-container *ngFor="let column of columns" [matColumnDef]="column.key">
          <th mat-header-cell *matHeaderCellDef [style.width]="column.width">
            {{ column.label }}
          </th>
          <td mat-cell *matCellDef="let row">
            <!-- Text Column -->
            <span *ngIf="column.type === 'text' || !column.type">
              {{ getNestedProperty(row, column.key) }}
            </span>

            <!-- Image Column -->
            <div *ngIf="column.type === 'image'" class="image-cell">
              <img *ngIf="getNestedProperty(row, column.imageProperty || column.key)" 
                   [src]="getNestedProperty(row, column.imageProperty || column.key)" 
                   class="thumb" 
                   [alt]="getNestedProperty(row, 'title') || getNestedProperty(row, 'name')">
              <mat-icon *ngIf="!getNestedProperty(row, column.imageProperty || column.key)" class="icon-placeholder">
                {{ getDefaultIcon(column.key) }}
              </mat-icon>
            </div>

            <!-- Badge Column -->
            <span *ngIf="column.type === 'badge'" 
                  class="badge" 
                  [ngClass]="getBadgeClass(column, getNestedProperty(row, column.key))">
              {{ getBadgeLabel(column, getNestedProperty(row, column.key)) }}
            </span>

            <!-- Toggle Column -->
            <mat-slide-toggle *ngIf="column.type === 'toggle'" 
                              [checked]="getNestedProperty(row, column.key)"
                              (change)="onToggleChange(row, column.key, $event.checked)">
            </mat-slide-toggle>

            <!-- Date Column -->
            <span *ngIf="column.type === 'date'">
              {{ formatDate(getNestedProperty(row, column.key)) }}
            </span>

            <!-- Number Column -->
            <span *ngIf="column.type === 'number'">
              {{ formatNumber(getNestedProperty(row, column.key)) }}
            </span>
          </td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions" *ngIf="actions.length > 0">
          <th mat-header-cell *matHeaderCellDef width="120px">Actions</th>
          <td mat-cell *matCellDef="let row">
            <button *ngFor="let action of actions" 
                    mat-icon-button 
                    [color]="action.color || 'primary'"
                    [matTooltip]="action.tooltip || action.label"
                    (click)="onActionClick(action.key, row)">
              <mat-icon>{{ action.icon }}</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <!-- Empty State -->
      <div *ngIf="!loading && items.length === 0" class="empty-state">
        <mat-icon>{{ emptyIcon }}</mat-icon>
        <p>{{ emptyMessage }}</p>
      </div>

      <!-- Pagination -->
      <mat-paginator *ngIf="!loading && totalElements > 0"
                     [length]="totalElements"
                     [pageSize]="pageSize"
                     [pageSizeOptions]="pageSizeOptions"
                     [pageIndex]="currentPage"
                     (page)="onPageChange($event)"
                     showFirstLastButtons>
      </mat-paginator>
    </div>
  `,
  styles: [`
    .table-container {
      background: var(--surface);
      border-radius: 12px;
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
      overflow: hidden;
    }

    .filter-bar {
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
      flex-wrap: wrap;
      background: var(--surface);
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 40px;
    }

    .data-table {
      width: 100%;
      background: var(--surface);
    }

    .image-cell {
      display: flex;
      align-items: center;
    }

    .thumb {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid var(--border);
    }

    .icon-placeholder {
      color: var(--text-disabled);
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      
      &.published { background: #e8f5e9; color: #2e7d32; }
      &.draft { background: #fff3e0; color: #e65100; }
      &.featured { background: #e3f2fd; color: #1565c0; }
      &.active { background: #e8f5e9; color: #2e7d32; }
      &.inactive { background: #fce4ec; color: #c62828; }
      &.unread { background: #fce4ec; color: #c62828; }
      &.read { background: #f5f5f5; color: #757575; }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px;
      color: var(--text-muted);
      
      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
      }
    }

    .mat-mdc-row:hover {
      background: var(--surface-alt);
    }

    // Dark mode specific styles
    :host-context(.dark-mode) .badge {
      &.published { background: #1b2e1b; color: #81c784; }
      &.draft { background: #2e1e1a; color: #ffb74d; }
      &.featured { background: #1a1e2e; color: #64b5f6; }
      &.active { background: #1b2e1b; color: #81c784; }
      &.inactive { background: #2e1a1a; color: #e57373; }
      &.unread { background: #2e1a1a; color: #e57373; }
      &.read { background: #2a2a2a; color: #a0a0a0; }
    }
  `]
})
export class BaseTableComponent implements OnInit, OnDestroy {
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() filters: FilterOption[] = [];
  @Input() items: any[] = [];
  @Input() loading = false;
  @Input() totalElements = 0;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [10, 25, 50, 100];
  @Input() currentPage = 0;
  @Input() searchable = true;
  @Input() showFilters = true;
  @Input() emptyMessage = 'No data available';
  @Input() emptyIcon = 'inbox';

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() actionClick = new EventEmitter<{ action: string; item: any }>();
  @Output() toggleChange = new EventEmitter<{ item: any; field: string; value: boolean }>();
  @Output() filterChange = new EventEmitter<any>();

  searchTerm = '';
  filterValues: { [key: string]: any } = {};
  displayedColumns: string[] = [];

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.setupColumns();
    this.setupSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupColumns() {
    this.displayedColumns = this.columns.map(col => col.key);
    if (this.actions.length > 0) {
      this.displayedColumns.push('actions');
    }
  }

  private setupSearch() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.filterValues['keyword'] = term;
      this.onFilterChange();
    });

    // Watch search term changes
    this.searchSubject.next(this.searchTerm);
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }

  onActionClick(action: string, item: any) {
    if (action === 'delete') {
      this.confirmDelete(item);
    } else {
      this.actionClick.emit({ action, item });
    }
  }

  onToggleChange(item: any, field: string, value: boolean) {
    this.toggleChange.emit({ item, field, value });
  }

  onFilterChange() {
    this.filterChange.emit(this.filterValues);
  }

  private confirmDelete(item: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Item',
        message: `Are you sure you want to delete "${item.title || item.name || 'this item'}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actionClick.emit({ action: 'delete', item });
      }
    });
  }

  getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o && o[p], obj);
  }

  getBadgeClass(column: TableColumn, value: any): string {
    if (!column.badgeConfig || !value) return '';
    const config = column.badgeConfig[value];
    return config ? config.class : '';
  }

  getBadgeLabel(column: TableColumn, value: any): string {
    if (!column.badgeConfig || !value) return value;
    const config = column.badgeConfig[value];
    return config?.label || value;
  }

  getDefaultIcon(columnKey: string): string {
    const iconMap: { [key: string]: string } = {
      'cover': 'image',
      'logo': 'business',
      'photo': 'person',
      'image': 'image',
      'media': 'perm_media'
    };
    return iconMap[columnKey] || 'image';
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  formatNumber(num: number): string {
    if (num === null || num === undefined) return '';
    return num.toLocaleString();
  }
}