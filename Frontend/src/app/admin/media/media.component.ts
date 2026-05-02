import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MediaService } from '../../core/services/media.service';
import { MediaResponse } from '../../core/models/media.model';
import { ConfirmDialogComponent } from '../../admin/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatPaginatorModule, MatDialogModule, MatTooltipModule
  ],
  template: `
    <div class="page-header">
      <h1>Media Library</h1>
      <button mat-flat-button color="primary" (click)="fileInput.click()">
        <mat-icon>upload</mat-icon> Upload
      </button>
      <input #fileInput type="file" hidden accept="image/*,application/pdf" multiple (change)="onFiles($event)">
    </div>

    <div class="filter-bar card" style="margin-bottom:16px">
      <mat-form-field appearance="outline" style="max-width:200px">
        <mat-label>Category</mat-label>
        <mat-select [(ngModel)]="filterCat" (ngModelChange)="load()">
          <mat-option value="">All</mat-option>
          <mat-option *ngFor="let c of categories" [value]="c">{{ c }}</mat-option>
        </mat-select>
      </mat-form-field>
      <span *ngIf="uploading" style="display:flex;align-items:center;gap:8px">
        <mat-spinner diameter="20"></mat-spinner> Uploading...
      </span>
    </div>

    <div *ngIf="loading" style="display:flex;justify-content:center;padding:40px"><mat-spinner diameter="40"></mat-spinner></div>

    <div class="media-grid" *ngIf="!loading">
      <div class="media-card" *ngFor="let m of items">
        <div class="media-img">
          <img *ngIf="isImage(m)" [src]="m.url" [alt]="m.altText || m.fileName">
          <div *ngIf="!isImage(m)" class="file-icon">
            <mat-icon>insert_drive_file</mat-icon>
          </div>
        </div>
        <div class="media-info">
          <span class="media-name" [matTooltip]="m.fileName">{{ m.fileName }}</span>
          <span class="badge" style="font-size:10px">{{ m.category }}</span>
        </div>
        <div class="media-actions">
          <a [href]="m.url" target="_blank" mat-icon-button matTooltip="View"><mat-icon>open_in_new</mat-icon></a>
          <button mat-icon-button color="warn" (click)="delete(m)" matTooltip="Delete"><mat-icon>delete</mat-icon></button>
        </div>
      </div>
    </div>

    <div *ngIf="!loading && items.length === 0" style="text-align:center;padding:60px;color:#9e9e9e">
      <mat-icon style="font-size:64px;width:64px;height:64px">photo_library</mat-icon>
      <p>No media files yet</p>
    </div>

    <mat-paginator [length]="total" [pageSize]="pageSize" [pageSizeOptions]="[20,40,80]" (page)="onPage($event)"></mat-paginator>
  `,
  styles: [`
    .media-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 12px;
    }
    .media-card {
      background: var(--surface); border-radius: 10px;
      border: 1px solid var(--border); overflow: hidden;
      box-shadow: var(--shadow);
    }
    .media-img {
      aspect-ratio: 1; overflow: hidden; background: #f5f5f5;
      img { width: 100%; height: 100%; object-fit: cover; }
    }
    .file-icon { display: flex; align-items: center; justify-content: center; height: 100%; mat-icon { font-size: 48px; width: 48px; height: 48px; color: #9e9e9e; } }
    .media-info { padding: 8px; display: flex; flex-direction: column; gap: 4px; }
    .media-name { font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .media-actions { display: flex; justify-content: flex-end; padding: 0 4px 4px; }

    @media (max-width: 768px) {
      .media-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 10px;
      }
      
      .filter-bar {
        padding: 12px;
      }
    }

    @media (max-width: 480px) {
      .media-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }
      
      .media-name {
        font-size: 11px;
      }
      
      .file-icon mat-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
      }
    }
  `]
})
export class MediaComponent implements OnInit {
  private svc = inject(MediaService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  items: MediaResponse[] = [];
  loading = false;
  uploading = false;
  filterCat = '';
  page = 0; pageSize = 20; total = 0;
  categories = ['general', 'project', 'service', 'gallery', 'team', 'client', 'review', 'about', 'settings'];

  ngOnInit() { this.load(); }

  load() {
    this.zone.run(() => {
      this.loading = true;
      this.cdr.markForCheck();
    });
    
    this.svc.getAll(this.filterCat || undefined, undefined, this.page, this.pageSize).subscribe({
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

  onFiles(event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files || []);
    if (!files.length) return;
    this.uploading = true;
    let done = 0;
    files.forEach(f => {
      this.svc.upload(f, 'general').subscribe({
        next: () => { done++; if (done === files.length) { this.uploading = false; this.snack.open('Uploaded!', '', { duration: 2000 }); this.load(); } },
        error: () => { done++; if (done === files.length) { this.uploading = false; } }
      });
    });
  }

  delete(m: MediaResponse) {
    this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete Media', message: `Delete "${m.fileName}"?` } })
      .afterClosed().subscribe(ok => {
        if (!ok) return;
        this.svc.delete(m.id).subscribe({ next: () => { this.snack.open('Deleted', '', { duration: 2000 }); this.load(); } });
      });
  }

  isImage(m: MediaResponse) { return m.mimeType?.startsWith('image/'); }
}
