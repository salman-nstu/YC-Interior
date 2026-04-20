import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ServiceService } from '../../../core/services/service.service';
import { ServiceResponse } from '../../../core/models/service.model';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatPaginatorModule,
    MatSnackBarModule, MatDialogModule, MatTooltipModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="page-header">
      <h1>Services</h1>
      <a mat-flat-button color="primary" routerLink="/services/new">
        <mat-icon>add</mat-icon> New Service
      </a>
    </div>
    <div class="table-container">
      <div class="filter-bar">
        <mat-form-field appearance="outline">
          <mat-label>Search</mat-label>
          <input matInput [(ngModel)]="keyword" (ngModelChange)="onSearch()" placeholder="Search services...">
          <mat-icon matSuffix>search</mat-icon>
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
          <td mat-cell *matCellDef="let row"><strong>{{ row.title }}</strong></td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let row"><span class="badge" [ngClass]="row.status">{{ row.status }}</span></td>
        </ng-container>
        <ng-container matColumnDef="order">
          <th mat-header-cell *matHeaderCellDef>Order</th>
          <td mat-cell *matCellDef="let row">{{ row.displayOrder }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let row">
            <a mat-icon-button [routerLink]="['/services', row.id, 'edit']" matTooltip="Edit"><mat-icon>edit</mat-icon></a>
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
export class ServicesListComponent implements OnInit {
  private svc = inject(ServiceService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  items: ServiceResponse[] = [];
  cols = ['cover', 'title', 'status', 'order', 'actions'];
  loading = false;
  keyword = '';
  page = 0; pageSize = 10; total = 0;
  private timer: any;

  ngOnInit() { this.load(); }

  load() {
    this.zone.run(() => {
      this.loading = true;
      this.cdr.markForCheck();
    });
    
    console.log('🔄 Loading services...');
    
    this.svc.getAll(this.keyword || undefined, this.page, this.pageSize).subscribe({
      next: r => { 
        console.log('✅ Services loaded', r);
        this.zone.run(() => {
          this.items = r.data?.content || []; 
          this.total = r.data?.totalElements || 0; 
          this.loading = false; 
          this.cdr.markForCheck();
          console.log('🎯 Loading state:', this.loading);
        });
      },
      error: err => { 
        console.error('❌ Services load error', err);
        this.zone.run(() => {
          this.loading = false;
          this.cdr.markForCheck();
          this.snack.open('Error loading services: ' + (err.error?.message || err.message || 'Unknown error'), '', { duration: 5000 });
        });
      }
    });
  }

  onSearch() { clearTimeout(this.timer); this.timer = setTimeout(() => { this.page = 0; this.load(); }, 400); }
  onPage(e: PageEvent) { this.page = e.pageIndex; this.pageSize = e.pageSize; this.load(); }

  delete(row: ServiceResponse) {
    this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete Service', message: `Delete "${row.title}"?` } })
      .afterClosed().subscribe(ok => {
        if (!ok) return;
        this.svc.delete(row.id).subscribe({ next: () => { this.snack.open('Deleted', '', { duration: 2000 }); this.load(); } });
      });
  }
}
