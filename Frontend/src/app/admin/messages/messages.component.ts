import { Component, OnInit, inject, ChangeDetectorRef, NgZone, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MiscService } from '../../core/services/misc.service';
import { ContactMessageResponse } from '../../core/models/misc.model';
import { ConfirmDialogComponent } from '../../admin/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-message-view-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>Message Details</h2>
      <button mat-icon-button mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <mat-dialog-content>
      <div class="message-details">
        <div class="detail-row">
          <label>Status:</label>
          <span class="badge" [ngClass]="data.isRead ? 'read' : 'unread'">
            {{ data.isRead ? 'Read' : 'Unread' }}
          </span>
        </div>
        <div class="detail-row">
          <label>Name:</label>
          <span>{{ data.name }}</span>
        </div>
        <div class="detail-row">
          <label>Email:</label>
          <span>{{ data.email }}</span>
        </div>
        <div class="detail-row">
          <label>Phone:</label>
          <span>{{ data.phone }}</span>
        </div>
        <div class="detail-row">
          <label>Subject:</label>
          <span>{{ data.subject }}</span>
        </div>
        <div class="detail-row">
          <label>Date:</label>
          <span>{{ data.createdAt | date:'medium' }}</span>
        </div>
        <div class="detail-row message-content">
          <label>Message:</label>
          <div class="message-text">{{ data.message }}</div>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px 0;
      
      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
      }
    }

    mat-dialog-content {
      padding: 24px;
      min-width: 500px;
    }

    @media (max-width: 768px) {
      mat-dialog-content {
        min-width: unset;
        width: 100%;
        padding: 16px;
      }

      .detail-row {
        grid-template-columns: 100px 1fr;
        gap: 12px;
        
        label {
          font-size: 13px;
        }
        
        span {
          font-size: 13px;
        }
      }

      .message-content .message-text {
        font-size: 13px;
        padding: 10px;
      }
    }

    @media (max-width: 480px) {
      .detail-row {
        grid-template-columns: 1fr;
        gap: 4px;
        
        label {
          font-weight: 700;
        }
      }
    }

    .message-details {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .detail-row {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 16px;
      align-items: start;
      
      label {
        font-weight: 600;
        color: #666;
      }
      
      span {
        color: #333;
      }
    }

    .message-content {
      align-items: start;
      
      .message-text {
        background-color: #f5f5f5;
        padding: 12px;
        border-radius: 4px;
        white-space: pre-wrap;
        word-break: break-word;
        line-height: 1.6;
      }
    }

    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      
      &.read {
        background-color: #e8f5e9;
        color: #2e7d32;
      }
      
      &.unread {
        background-color: #ffebee;
        color: #c62828;
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
    }
  `]
})
export class MessageViewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ContactMessageResponse) {}
}

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
            <button mat-icon-button (click)="viewMessage(row)" matTooltip="View details">
              <mat-icon>visibility</mat-icon>
            </button>
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
  `,
  styles: [`
    @media (max-width: 768px) {
      .table-container {
        overflow-x: auto;
      }
      
      table {
        min-width: 600px;
      }
      
      .filter-bar {
        padding: 12px;
      }
    }

    @media (max-width: 480px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
        
        h1 {
          font-size: 18px;
        }
      }
    }
  `]
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

  viewMessage(row: ContactMessageResponse) {
    this.dialog.open(MessageViewDialogComponent, {
      data: row,
      width: '600px',
      maxWidth: '90vw'
    });
  }

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
