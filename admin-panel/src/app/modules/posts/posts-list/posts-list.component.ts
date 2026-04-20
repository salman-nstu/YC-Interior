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
import { MiscService } from '../../../core/services/misc.service';
import { PostResponse } from '../../../core/models/misc.model';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatPaginatorModule, MatSnackBarModule, MatDialogModule,
    MatTooltipModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="page-header">
      <h1>Posts</h1>
      <a mat-flat-button color="primary" routerLink="/posts/new"><mat-icon>add</mat-icon> New Post</a>
    </div>
    <div class="table-container">
      <div class="filter-bar">
        <mat-form-field appearance="outline">
          <mat-label>Search</mat-label>
          <input matInput [(ngModel)]="keyword" (ngModelChange)="onSearch()">
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
          <mat-select [(ngModel)]="catFilter" (ngModelChange)="load()">
            <mat-option [value]="null">All</mat-option>
            <mat-option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div *ngIf="loading" style="display:flex;justify-content:center;padding:40px"><mat-spinner diameter="40"></mat-spinner></div>
      <table mat-table [dataSource]="items" *ngIf="!loading">
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
          <td mat-cell *matCellDef="let row"><span class="badge" [ngClass]="row.status">{{ row.status }}</span></td>
        </ng-container>
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Created</th>
          <td mat-cell *matCellDef="let row">{{ row.createdAt | date:'mediumDate' }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let row">
            <a mat-icon-button [routerLink]="['/posts', row.id, 'edit']" matTooltip="Edit"><mat-icon>edit</mat-icon></a>
            <button mat-icon-button color="warn" (click)="delete(row)" matTooltip="Delete"><mat-icon>delete</mat-icon></button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols;"></tr>
      </table>
      <mat-paginator [length]="total" [pageSize]="pageSize" [pageSizeOptions]="[10,25,50]" (page)="onPage($event)"></mat-paginator>
    </div>
  `
})
export class PostsListComponent implements OnInit {
  private svc = inject(MiscService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  items: PostResponse[] = [];
  categories: any[] = [];
  cols = ['cover', 'title', 'status', 'date', 'actions'];
  loading = false;
  keyword = ''; statusFilter = ''; catFilter: number | null = null;
  page = 0; pageSize = 10; total = 0;
  private timer: any;

  ngOnInit() {
    this.svc.getPostCategories().subscribe(r => this.categories = r.data || []);
    this.load();
  }

  load() {
    this.zone.run(() => {
      this.loading = true;
      this.cdr.markForCheck();
    });
    
    this.svc.getPosts(this.keyword || undefined, this.statusFilter || undefined, this.catFilter || undefined, this.page, this.pageSize).subscribe({
      next: r => {
        this.zone.run(() => {
          this.items = r.data?.content || [];
          this.total = r.data?.totalElements || 0;
          this.loading = false;
          this.cdr.markForCheck();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.loading = false;
          this.cdr.markForCheck();
        });
      }
    });
  }

  onSearch() { clearTimeout(this.timer); this.timer = setTimeout(() => { this.page = 0; this.load(); }, 400); }
  onPage(e: PageEvent) { this.page = e.pageIndex; this.pageSize = e.pageSize; this.load(); }

  delete(row: PostResponse) {
    this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete Post', message: `Delete "${row.title}"?` } })
      .afterClosed().subscribe(ok => {
        if (!ok) return;
        this.svc.deletePost(row.id).subscribe({ next: () => { this.snack.open('Deleted', '', { duration: 2000 }); this.load(); } });
      });
  }
}
