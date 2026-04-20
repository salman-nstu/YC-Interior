import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MediaService } from '../../core/services/media.service';
import { MediaResponse } from '../../core/models/media.model';
import { environment } from '../../environments/environment';

// ─── Dialog Component ─────────────────────────────────────────────────────────
@Component({
  selector: 'app-media-picker-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule, MatTabsModule
  ],
  template: `
    <h2 mat-dialog-title>Select Media</h2>
    <mat-dialog-content>
      <mat-tab-group>
        <!-- Upload Tab -->
        <mat-tab label="Upload New">
          <div class="upload-tab">
            <div class="upload-zone" (click)="fileInput.click()" (dragover)="$event.preventDefault()" (drop)="onDrop($event)">
              <mat-icon>cloud_upload</mat-icon>
              <p>Click or drag & drop to upload</p>
              <small>Max 10MB — Images, PDF</small>
            </div>
            <input #fileInput type="file" hidden accept="image/*,application/pdf" (change)="onFileSelected($event)">
            <div *ngIf="uploading" class="upload-progress">
              <mat-spinner diameter="32"></mat-spinner>
              <span>Uploading...</span>
            </div>
          </div>
        </mat-tab>

        <!-- Library Tab -->
        <mat-tab label="Media Library">
          <div class="library-filters">
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Category</mat-label>
              <mat-select [(ngModel)]="filterCategory" (ngModelChange)="loadMedia()">
                <mat-option value="">All</mat-option>
                <mat-option *ngFor="let c of categories" [value]="c">{{ c }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div *ngIf="loading" class="loading-center">
            <mat-spinner diameter="40"></mat-spinner>
          </div>

          <div class="media-grid" *ngIf="!loading">
            <div *ngFor="let m of mediaList"
                 class="media-item"
                 [class.selected]="selected?.id === m.id"
                 (click)="select(m)">
              <img *ngIf="isImage(m)" [src]="m.url" [alt]="m.altText || m.fileName">
              <div *ngIf="!isImage(m)" class="file-icon">
                <mat-icon>insert_drive_file</mat-icon>
                <span>{{ m.fileName }}</span>
              </div>
              <div class="check" *ngIf="selected?.id === m.id">
                <mat-icon>check_circle</mat-icon>
              </div>
            </div>
          </div>

          <div *ngIf="!loading && mediaList.length === 0" class="empty">
            <mat-icon>photo_library</mat-icon>
            <p>No media found</p>
          </div>

          <div class="pagination" *ngIf="totalPages > 1">
            <button mat-button [disabled]="currentPage === 0" (click)="changePage(currentPage - 1)">Prev</button>
            <span>{{ currentPage + 1 }} / {{ totalPages }}</span>
            <button mat-button [disabled]="currentPage >= totalPages - 1" (click)="changePage(currentPage + 1)">Next</button>
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="!selected" (click)="confirm()">Select</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content { min-width: 600px; max-height: 70vh; }
    .upload-tab { padding: 24px 0; }
    .upload-zone {
      border: 2px dashed #ccc; border-radius: 12px; padding: 40px;
      text-align: center; cursor: pointer;
      mat-icon { font-size: 48px; width: 48px; height: 48px; color: #9e9e9e; }
      p { margin-top: 8px; color: #757575; }
      small { color: #9e9e9e; font-size: 12px; }
      &:hover { border-color: #388e3c; background: #f1f8e9; }
    }
    .upload-progress { display: flex; align-items: center; gap: 12px; margin-top: 16px; justify-content: center; }
    .library-filters { padding: 12px 0; }
    .filter-field { width: 200px; }
    .loading-center { display: flex; justify-content: center; padding: 40px; }
    .media-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 8px; padding: 8px 0;
    }
    .media-item {
      position: relative; border-radius: 8px; overflow: hidden;
      border: 2px solid transparent; cursor: pointer; aspect-ratio: 1;
      background: #f5f5f5;
      img { width: 100%; height: 100%; object-fit: cover; }
      &:hover { border-color: #81c784; }
      &.selected { border-color: #388e3c; }
    }
    .file-icon { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 4px; padding: 8px; mat-icon { color: #757575; } span { font-size: 10px; text-align: center; word-break: break-all; } }
    .check { position: absolute; top: 4px; right: 4px; color: #388e3c; mat-icon { font-size: 20px; width: 20px; height: 20px; } }
    .empty { display: flex; flex-direction: column; align-items: center; padding: 40px; color: #9e9e9e; mat-icon { font-size: 48px; width: 48px; height: 48px; } }
    .pagination { display: flex; align-items: center; justify-content: center; gap: 16px; padding: 8px 0; }
  `]
})
export class MediaPickerDialogComponent implements OnInit {
  private mediaService = inject(MediaService);
  private dialogRef = inject(MatDialogRef<MediaPickerDialogComponent>);
  data = inject(MAT_DIALOG_DATA);

  mediaList: MediaResponse[] = [];
  selected: MediaResponse | null = null;
  loading = false;
  uploading = false;
  filterCategory = '';
  currentPage = 0;
  totalPages = 1;
  categories = ['general', 'project', 'service', 'gallery', 'team', 'client', 'review', 'about', 'settings'];

  ngOnInit() { this.loadMedia(); }

  loadMedia() {
    this.loading = true;
    this.mediaService.getAll(this.filterCategory || undefined, undefined, this.currentPage, 20).subscribe({
      next: res => {
        this.mediaList = res.data?.content || [];
        this.totalPages = res.data?.totalPages || 1;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.uploadFile(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) this.uploadFile(file);
  }

  uploadFile(file: File) {
    this.uploading = true;
    const cat = this.data?.category || 'general';
    this.mediaService.upload(file, cat).subscribe({
      next: res => {
        this.uploading = false;
        this.selected = res.data;
        this.dialogRef.close(res.data);
      },
      error: () => { this.uploading = false; }
    });
  }

  select(m: MediaResponse) { this.selected = m; }
  confirm() { this.dialogRef.close(this.selected); }
  isImage(m: MediaResponse) { return m.mimeType?.startsWith('image/'); }
  changePage(p: number) { this.currentPage = p; this.loadMedia(); }
}

// ─── Inline Upload Component ──────────────────────────────────────────────────
@Component({
  selector: 'app-media-picker',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="picker-wrap">
      <div *ngIf="value" class="preview-wrap">
        <img *ngIf="isImage(value)" [src]="value.url" class="preview-img" [alt]="value.altText">
        <div *ngIf="!isImage(value)" class="file-preview">
          <mat-icon>insert_drive_file</mat-icon>
          <span>{{ value.fileName }}</span>
        </div>
        <button mat-icon-button class="remove-btn" (click)="clear()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <button mat-stroked-button (click)="open()" type="button">
        <mat-icon>{{ value ? 'swap_horiz' : 'add_photo_alternate' }}</mat-icon>
        {{ value ? 'Change' : label }}
      </button>
    </div>
  `,
  styles: [`
    .picker-wrap { display: flex; flex-direction: column; gap: 8px; }
    .preview-wrap { position: relative; display: inline-block; }
    .preview-img { width: 120px; height: 90px; object-fit: cover; border-radius: 8px; border: 1px solid #e0e0e0; display: block; }
    .file-preview { display: flex; align-items: center; gap: 8px; padding: 8px; background: #f5f5f5; border-radius: 8px; }
    .remove-btn { position: absolute; top: -8px; right: -8px; background: white; box-shadow: 0 1px 4px rgba(0,0,0,.2); width: 24px; height: 24px; }
  `]
})
export class MediaPickerComponent {
  @Input() value: MediaResponse | null = null;
  @Input() label = 'Select Image';
  @Input() category = 'general';
  @Output() valueChange = new EventEmitter<MediaResponse | null>();

  private dialog = inject(MatDialog);

  open() {
    this.dialog.open(MediaPickerDialogComponent, {
      data: { category: this.category },
      width: '700px'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.value = result;
        this.valueChange.emit(result);
      }
    });
  }

  clear() {
    this.value = null;
    this.valueChange.emit(null);
  }

  isImage(m: MediaResponse) { return m?.mimeType?.startsWith('image/'); }
}
