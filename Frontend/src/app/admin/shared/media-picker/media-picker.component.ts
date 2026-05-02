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
import { MediaService } from '../../../core/services/media.service';
import { MediaResponse } from '../../../core/models/media.model';
import { environment } from '../../../environments/environment';

// ─── Dialog Component ─────────────────────────────────────────────────────────
@Component({
  selector: 'app-media-picker-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Upload Media</h2>
    <mat-dialog-content>
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
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
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

    @media (max-width: 768px) {
      mat-dialog-content {
        min-width: unset;
        width: 100%;
      }

      .upload-zone {
        padding: 30px 20px;
        
        mat-icon {
          font-size: 40px;
          width: 40px;
          height: 40px;
        }
        
        p {
          font-size: 14px;
        }
        
        small {
          font-size: 11px;
        }
      }
    }

    @media (max-width: 480px) {
      .upload-zone {
        padding: 24px 16px;
      }
    }
  `]
})
export class MediaPickerDialogComponent implements OnInit {
  private mediaService = inject(MediaService);
  private dialogRef = inject(MatDialogRef<MediaPickerDialogComponent>);
  data = inject(MAT_DIALOG_DATA);

  uploading = false;

  ngOnInit() { }

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
        this.dialogRef.close(res.data);
      },
      error: () => { 
        this.uploading = false; 
      }
    });
  }
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

    @media (max-width: 768px) {
      .preview-img {
        width: 100px;
        height: 75px;
      }
      
      button {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .preview-img {
        width: 80px;
        height: 60px;
      }
      
      .file-preview {
        font-size: 12px;
        padding: 6px;
      }
    }
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
