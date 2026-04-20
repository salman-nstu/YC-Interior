import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProjectService } from '../../../core/services/project.service';
import { ProjectResponse } from '../../../core/models/project.model';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatPaginatorModule, MatSnackBarModule, MatDialogModule,
    MatTooltipModule, MatProgressSpinnerModule, MatSlideToggleModule
  ],
  template: `
    <div class="page-header">
      <h1>Projects</h1>
      <a mat-flat-button color="primary" routerLink="/projects/new">
        <mat-icon>add</mat-icon> New Project
      </a>
    </div>

    <div class="table-container">
      <div class="filter-bar">
        <mat-form-field appearance="outline">
          <mat-label>Search</mat-label>
          <input matInput [(ngModel)]="keyword" (ngModelChange)="onSearch()" placeholder="Search projects...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <mat-form-field appearance="outline" style="max-width:160px">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="statusFilter" (ngModelChange)="load()">
            <mat-option value="">All</mat-option>
            <mat-option value="published">Published</mat-option>
            <mat-option value="draft">Draft</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" style="max-width:180px">
          <mat-label>Category</mat-label>
          <mat-select [(ngModel)]="categoryFilter" (ngModelChange)="load()">
            <mat-option [value]="null">All</mat-option>
            <mat-option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div *ngIf="loading" style="display:flex;justify-content:center;padding:40px">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <table mat-table [dataSource]="projects" *ngIf="!loading">
        <ng-container matColumnDef="cover">
          <th mat-header-cell *matHeaderCellDef>Cover</th>
          <td mat-cell *matCellDef="let row">
            <img *ngIf="row.coverMedia" [src]="row.coverMedia.url" class="thumb" [alt]="row.title">
            <mat-icon *ngIf="!row.coverMedia" style="color:#ccc">image</mat-icon>
          </td>
        </ng-container>
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Title</th>
          <td mat-cell *matCellDef="let row">
            <strong>{{ row.title }}</strong>
            <div style="font-size:12px;color:#757575">{{ row.category?.name }}</div>
          </td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let row">
            <span class="badge" [ngClass]="row.status">{{ row.status }}</span>
          </td>
        </ng-container>
        <ng-container matColumnDef="featured">
          <th mat-header-cell *matHeaderCellDef>Featured</th>
          <td mat-cell *matCellDef="let row">
            <mat-slide-toggle [checked]="row.isFeatured" (change)="toggleFeatured(row, $event.checked)" color="primary"></mat-slide-toggle>
          </td>
        </ng-container>
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Created</th>
          <td mat-cell *matCellDef="let row">{{ row.createdAt | date:'mediumDate' }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let row">
            <a mat-icon-button [routerLink]="['/projects', row.id, 'edit']" matTooltip="Edit">
              <mat-icon>edit</mat-icon>
            </a>
            <button mat-icon-button color="warn" (click)="delete(row)" matTooltip="Delete">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols;"></tr>
      </table>

      <mat-paginator
        [length]="total"
        [pageSize]="pageSize"
        [pageSizeOptions]="[10, 25, 50]"
        (page)="onPage($event)">
      </mat-paginator>
    </div>
  `
})
export class ProjectsListComponent implements OnInit {
  private svc = inject(ProjectService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  projects: ProjectResponse[] = [];
  categories: any[] = [];
  cols = ['cover', 'title', 'status', 'featured', 'date', 'actions'];
  loading = false;
  keyword = '';
  statusFilter = '';
  categoryFilter: number | null = null;
  page = 0;
  pageSize = 10;
  total = 0;
  private searchTimer: any;

  ngOnInit() {
    this.svc.getCategories().subscribe(r => this.categories = r.data || []);
    this.load();
  }

  load() {
    this.zone.run(() => {
      this.loading = true;
      this.cdr.markForCheck();
    });
    
    console.log('🔄 Loading projects...');
    
    this.svc.getAll(this.keyword || undefined, this.statusFilter || undefined, this.categoryFilter || undefined, undefined, this.page, this.pageSize).subscribe({
      next: res => {
        console.log('✅ Projects loaded', res);
        this.zone.run(() => {
          this.projects = res.data?.content || [];
          this.total = res.data?.totalElements || 0;
          this.loading = false;
          this.cdr.markForCheck();
          console.log('🎯 Loading state:', this.loading);
        });
      },
      error: err => { 
        console.error('❌ Projects load error', err);
        this.zone.run(() => {
          this.loading = false;
          this.cdr.markForCheck();
          this.snack.open('Error loading projects: ' + (err.error?.message || err.message || 'Unknown error'), '', { duration: 5000 });
        });
      }
    });
  }

  onSearch() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.page = 0; this.load(); }, 400);
  }

  onPage(e: PageEvent) { this.page = e.pageIndex; this.pageSize = e.pageSize; this.load(); }

  toggleFeatured(row: ProjectResponse, val: boolean) {
    this.svc.setFeatured(row.id, val).subscribe({
      next: res => { row.isFeatured = res.data.isFeatured; this.snack.open('Updated', '', { duration: 2000 }); },
      error: err => { this.snack.open(err.error?.message || 'Error', '', { duration: 3000 }); this.load(); }
    });
  }

  delete(row: ProjectResponse) {
    this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete Project', message: `Delete "${row.title}"?` } })
      .afterClosed().subscribe(ok => {
        if (!ok) return;
        this.svc.delete(row.id).subscribe({
          next: () => { this.snack.open('Deleted', '', { duration: 2000 }); this.load(); },
          error: () => this.snack.open('Error deleting', '', { duration: 3000 })
        });
      });
  }
}
