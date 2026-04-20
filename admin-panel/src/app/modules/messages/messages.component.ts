import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MiscService } from '../../core/services/misc.service';
import { ContactMessageResponse } from '../../core/models/misc.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatSelectModule, MatDialogModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatPaginatorModule, MatTooltipModule
  ],
  template: `
    <div class="page-header">
      <h1>Contact Messages</h1>
    </div>
    <div class="table-container">
      <div class="filter-bar">
        <mat-form-field appearance="outline" style="max-width:180px">
          <mat-label>Filter</mat-label>
          <mat-select [(ngModel)]="readFilter" (ngModelChange)="load()">
            <mat-option [value]="null">All</mat-option>
            <mat-option [value]="false">Unread</mat-option>
            <mat-option [value]="true">Read</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div *ngIf="loading" style="display:flex;justify-content:center;padding:40px"><mat-spinner diameter="40"></mat-spinner></div>
      <table mat-table [dataSource]="items" *ngIf="!loading">
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let row">
            <span class="badge" [ngClass]="row.isRead ? 'read' : 'unread'">{{ row.isRead ? 'Read' : 'Unread' }}</span>
          </td>
        </ng-container>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let row">
            <strong>{{ row.name }}</strong>
            <div style="font-size:12px;color:#757575">{{ row.email }}</div>
          </td>
        </ng-container>
        <ng-container matColumnDef="subject">
          <th mat-header-cell *matHeaderCellDef>Subject</th>
          <td mat-cell *matCellDef="let row">{{ row.subject }}</td>
        </ng-container>
        <ng-container matColumnDef="message">
          <th mat-header-cell *matHeaderCellDef>Message</th>
          <td mat-cell *matCellDef="let row" style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ row.message }}</td>
        </ng-container>
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let row">{{ row.createdAt | date:'mediumDate' }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let row">
            <button mat-icon-button *ngIf="!row.isRead" (click)="markRead(row)" matTooltip="Mark as read">
              <mat-icon>mark_email_read</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="delete(row)" matTooltip="Delete">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols;" [style.font-weight]="row.isRead ? 'normal' : '600'"></tr>
      </table>
      <mat-paginator [length]="total" [pageSize]="pageSize" [pageSizeOptions]="[10,25,50]" (page)="onPage($event)"></mat-paginator>
    </div>
  `
})
export class MessagesComponent implements OnInit {
  private svc = inject(MiscService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  items: ContactMessageResponse[] = [];
  cols = ['status', 'name', 'subject', 'message', 'date', 'actions'];
  loading = false;
  readFilter: boolean | null = null;
  page = 0; pageSize = 10; total = 0;

  ngOnInit() { this.load(); }

  load() {
    this.zone.run(() => {
      this.loading = true;
      this.cdr.markForCheck();
    });
    
    this.svc.getMessages(this.readFilter ?? undefined, this.page, this.pageSize).subscribe({
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

  onPage(e: PageEvent) { this.page = e.pageIndex; this.pageSize = e.pageSize; this.load(); }

  markRead(row: ContactMessageResponse) {
    this.svc.markRead(row.id).subscribe({
      next: () => { row.isRead = true; this.snack.open('Marked as read', '', { duration: 2000 }); }
    });
  }

  delete(row: ContactMessageResponse) {
    this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete Message', message: 'Delete this message?' } })
      .afterClosed().subscribe(ok => {
        if (!ok) return;
        this.svc.deleteMessage(row.id).subscribe({ next: () => { this.snack.open('Deleted', '', { duration: 2000 }); this.load(); } });
      });
  }
}
