import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GalleryService } from '../../core/services/gallery.service';
import { GalleryResponse } from '../../core/models/gallery.model';
import { MediaPickerDialogComponent } from '../../admin/shared/media-picker/media-picker.component';
import { ConfirmDialogComponent } from '../../admin/shared/confirm-dialog/confirm-dialog.component';
import { MediaResponse } from '../../core/models/media.model';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule,
    MatPaginatorModule, MatSlideToggleModule, MatTooltipModule
  ],
  template: `
    <div class="page-header">
      <h1>Gallery</h1>
      <button mat-flat-button color="primary" (click)="openAddDialog()">
        <mat-icon>add</mat-icon> Add Image
      </button>
    </div>

    <div *ngIf="loading" style="display:flex;justify-content:center;padding:40px"><mat-spinner diameter="40"></mat-spinner></div>

    <div class="gallery-grid" *ngIf="!loading">
      <div class="gallery-card" *ngFor="let item of items">
        <div class="gallery-img-wrap">
          <img [src]="item.media.url" [alt]="item.title || 'Gallery'" *ngIf="item.media">
          <mat-icon *ngIf="!item.media" class="no-img">image</mat-icon>
          <div class="gallery-overlay">
            <button mat-icon-button (click)="edit(item)" matTooltip="Edit"><mat-icon>edit</mat-icon></button>
            <button mat-icon-button color="warn" (click)="delete(item)" matTooltip="Delete"><mat-icon>delete</mat-icon></button>
          </div>
        </div>
        <div class="gallery-info">
          <span class="gallery-title">{{ item.title || 'Untitled' }}</span>
          <mat-slide-toggle [checked]="item.isFeatured" (change)="toggleFeatured(item, $event.checked)" color="primary" matTooltip="Featured">
          </mat-slide-toggle>
        </div>
      </div>

      <div class="gallery-card add-card" (click)="openAddDialog()">
        <mat-icon>add_photo_alternate</mat-icon>
        <span>Add Image</span>
      </div>
    </div>

    <mat-paginator [length]="total" [pageSize]="pageSize" [pageSizeOptions]="[12,24,48]" (page)="onPage($event)"></mat-paginator>
  `,
  styles: [`
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
    }
    .gallery-card {
      border-radius: 12px; overflow: hidden;
      background: var(--surface); border: 1px solid var(--border);
      box-shadow: var(--shadow);
    }
    .gallery-img-wrap {
      position: relative; aspect-ratio: 1; overflow: hidden; background: #f5f5f5;
      img { width: 100%; height: 100%; object-fit: cover; }
      .no-img { font-size: 48px; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #ccc; }
    }
    .gallery-overlay {
      position: absolute; inset: 0; background: rgba(0,0,0,.5);
      display: flex; align-items: center; justify-content: center; gap: 8px;
      opacity: 0; transition: opacity .2s;
      button { color: white; }
    }
    .gallery-card:hover .gallery-overlay { opacity: 1; }
    .gallery-info {
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 12px;
    }
    .gallery-title { font-size: 13px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100px; }
    .add-card {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      cursor: pointer; border: 2px dashed var(--border); background: transparent;
      aspect-ratio: 1; gap: 8px; color: var(--text-muted);
      mat-icon { font-size: 36px; width: 36px; height: 36px; }
      &:hover { border-color: var(--matcha); color: var(--matcha); }
    }

    // Mobile responsive
    @media (max-width: 768px) {
      .gallery-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 12px;
      }
      
      .gallery-title {
        font-size: 12px;
        max-width: 80px;
      }
      
      .gallery-info {
        padding: 6px 10px;
      }
    }

    @media (max-width: 480px) {
      .gallery-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }
      
      .gallery-overlay {
        opacity: 1;
        background: rgba(0,0,0,.3);
      }
      
      .add-card {
        mat-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
        }
        
        span {
          font-size: 12px;
        }
      }
    }
  `]
})
export class GalleryComponent implements OnInit {
  private svc = inject(GalleryService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  items: GalleryResponse[] = [];
  loading = false;
  page = 0; pageSize = 12; total = 0;

  ngOnInit() { this.load(); }

  load() {
    this.zone.run(() => {
      this.loading = true;
      this.cdr.markForCheck();
    });
    
    this.svc.getAll(undefined, this.page, this.pageSize).subscribe({
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

  openAddDialog() {
    this.dialog.open(MediaPickerDialogComponent, { data: { category: 'gallery' }, width: '700px' })
      .afterClosed().subscribe((media: MediaResponse) => {
        if (!media) return;
        this.svc.create({ mediaId: media.id, title: media.fileName }).subscribe({
          next: () => { this.snack.open('Added to gallery', '', { duration: 2000 }); this.load(); },
          error: err => this.snack.open(err.error?.message || 'Error', '', { duration: 3000 })
        });
      });
  }

  edit(item: GalleryResponse) {
    const title = prompt('Title:', item.title || '');
    if (title === null) return;
    this.svc.update(item.id, { mediaId: item.mediaId, title }).subscribe({
      next: () => { this.snack.open('Updated', '', { duration: 2000 }); this.load(); }
    });
  }

  toggleFeatured(item: GalleryResponse, val: boolean) {
    this.svc.setFeatured(item.id, val).subscribe({
      next: res => { item.isFeatured = res.data.isFeatured; this.snack.open('Updated', '', { duration: 2000 }); },
      error: err => { this.snack.open(err.error?.message || 'Error', '', { duration: 3000 }); this.load(); }
    });
  }

  delete(item: GalleryResponse) {
    this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete', message: 'Remove from gallery?' } })
      .afterClosed().subscribe(ok => {
        if (!ok) return;
        this.svc.delete(item.id).subscribe({ next: () => { this.snack.open('Deleted', '', { duration: 2000 }); this.load(); } });
      });
  }
}
