import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil, finalize } from 'rxjs';
import { DataTableComponent, TableColumn, TableAction } from '../../shared/data-table/data-table.component';
import { MediaPickerComponent } from '../../shared/media-picker/media-picker.component';
import { TeamService } from '../../core/services/team.service';
import { TeamMemberResponse, TeamMemberRequest } from '../../core/models/misc.model';
import { MediaResponse } from '../../core/models/media.model';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    DataTableComponent, MediaPickerComponent
  ],
  template: `
    <app-data-table
      title="Team Members"
      createButtonText="Add Member"
      [columns]="columns"
      [actions]="actions"
      [items]="items"
      [loading]="loading"
      [totalElements]="totalElements"
      [pageSize]="pageSize"
      [currentPage]="currentPage"
      emptyMessage="No team members found"
      emptyIcon="group"
      (pageChange)="onPageChange($event)"
      (actionClick)="onActionClick($event)"
      (toggleChange)="onToggleChange($event)"
      (createClick)="openForm()">
    </app-data-table>

    <!-- Inline Form -->
    <div *ngIf="showForm" class="form-container">
      <div class="form-header">
        <h3>{{ editingItem ? 'Edit' : 'Add' }} Team Member</h3>
        <button mat-icon-button (click)="closeForm()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <form [formGroup]="form" (ngSubmit)="submitForm()">
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Name *</mat-label>
            <input matInput formControlName="name" placeholder="Enter member name">
            <mat-error>Name is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Designation *</mat-label>
            <input matInput formControlName="designation" placeholder="Enter designation">
            <mat-error>Designation is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Display Order</mat-label>
            <input matInput type="number" formControlName="displayOrder" placeholder="0" min="0" step="1">
          </mat-form-field>

          <div class="form-full">
            <label class="form-label">Photo</label>
            <app-media-picker 
              [value]="memberMedia" 
              category="team" 
              (valueChange)="memberMedia = $event">
            </app-media-picker>
          </div>
        </div>
        
        <div class="form-actions">
          <button mat-button type="button" (click)="closeForm()">Cancel</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || submitting">
            <mat-spinner diameter="20" *ngIf="submitting"></mat-spinner>
            {{ editingItem ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
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

    .form-label {
      font-size: 13px;
      color: var(--text-muted);
      display: block;
      margin-bottom: 8px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }
  `]
})
export class TeamComponent implements OnInit {
  private teamService = inject(TeamService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  // Table configuration
  columns: TableColumn[] = [
    {
      key: 'media.url',
      label: 'Photo',
      type: 'image',
      width: '80px',
      imageProperty: 'media.url'
    },
    {
      key: 'name',
      label: 'Name',
      type: 'text'
    },
    {
      key: 'designation',
      label: 'Designation',
      type: 'text'
    },
    {
      key: 'displayOrder',
      label: 'Order',
      type: 'number'
    }
  ];

  actions: TableAction[] = [
    { key: 'edit', label: 'Edit', icon: 'edit', color: 'primary', tooltip: 'Edit member' },
    { key: 'delete', label: 'Delete', icon: 'delete', color: 'warn', tooltip: 'Delete member' }
  ];

  // Data properties
  items: TeamMemberResponse[] = [];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  loading = false;

  // Form properties
  showForm = false;
  submitting = false;
  editingItem: TeamMemberResponse | null = null;
  memberMedia: MediaResponse | null = null;
  
  form = this.fb.group({
    name: ['', Validators.required],
    designation: ['', Validators.required],
    displayOrder: [0]
  });

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
      page: this.currentPage,
      size: this.pageSize
    };

    this.teamService.getAll(params)
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
            this.showError('Failed to load team members');
          }
        },
        error: (error) => {
          console.error('Load error:', error);
          this.showError(error.error?.message || 'Failed to load team members');
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onActionClick(event: { action: string; item: TeamMemberResponse }) {
    switch (event.action) {
      case 'edit':
        this.editItem(event.item);
        break;
      case 'delete':
        this.deleteItem(event.item);
        break;
    }
  }

  onToggleChange(event: { item: TeamMemberResponse; field: string; value: boolean }) {
    // Handle toggle changes if needed
  }

  openForm() {
    this.editingItem = null;
    this.memberMedia = null;
    this.form.reset({ displayOrder: 0 });
    this.showForm = true;
  }

  editItem(item: TeamMemberResponse) {
    this.editingItem = item;
    this.memberMedia = item.media || null;
    this.form.patchValue({
      name: item.name,
      designation: item.designation,
      displayOrder: item.displayOrder
    });
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingItem = null;
    this.memberMedia = null;
    this.form.reset();
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const formValue = this.form.value;
    const request: TeamMemberRequest = {
      name: formValue.name!,
      designation: formValue.designation!,
      displayOrder: formValue.displayOrder || 0,
      mediaId: this.memberMedia?.id
    };

    const operation = this.editingItem 
      ? this.teamService.update(this.editingItem.id!, request)
      : this.teamService.create(request);
    
    operation.pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.submitting = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccess(this.editingItem ? 'Member updated successfully' : 'Member created successfully');
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

  deleteItem(item: TeamMemberResponse) {
    this.teamService.delete(item.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.showSuccess('Member deleted successfully');
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