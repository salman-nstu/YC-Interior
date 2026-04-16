import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Media } from '../../../core/models/models';

@Component({
  selector: 'app-media-list',
  template: `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Media Library</h1>
          <p class="page-subtitle">Manage all uploaded images and files</p>
        </div>
        <label class="btn btn-primary" style="cursor:pointer">
          📤 Upload File
          <input type="file" multiple accept="image/*" (change)="onUpload($event)" style="display:none" id="media-upload-input" />
        </label>
      </div>

      <!-- Filters -->
      <div class="card" style="margin-bottom:20px">
        <div class="card-body" style="display:flex;gap:14px;flex-wrap:wrap;padding:16px 20px">
          <div class="search-bar" style="flex:1;min-width:200px">
            <span class="search-icon">🔍</span>
            <input class="form-control" [(ngModel)]="keyword" (input)="onSearch()" placeholder="Search files..." id="media-search" />
          </div>
          <select class="form-select" [(ngModel)]="filterCategory" (change)="loadMedia()" style="width:180px" id="media-category-filter">
            <option value="">All Categories</option>
            <option *ngFor="let cat of categories" [value]="cat">{{cat | titlecase}}</option>
          </select>
        </div>
      </div>

      <!-- Grid -->
      <div class="media-grid-page" *ngIf="mediaList.length">
        <div *ngFor="let m of mediaList" class="media-card">
          <div class="media-card-img">
            <img [src]="m.url" [alt]="m.altText || m.fileName" loading="lazy" />
            <div class="media-card-overlay">
              <button class="btn btn-danger btn-sm" (click)="confirmDelete(m)" id="delete-media-{{m.id}}">🗑️ Delete</button>
            </div>
          </div>
          <div class="media-card-info">
            <p class="truncate font-medium" style="font-size:12px">{{m.fileName}}</p>
            <p class="text-muted" style="font-size:11px">{{m.category}}</p>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!mediaList.length && !loading">
        <div class="empty-icon">🖼️</div>
        <p class="empty-title">No media files yet</p>
        <p class="empty-desc">Upload images to get started</p>
      </div>

      <app-pagination [totalPages]="totalPages" [currentPage]="page" (pageChange)="onPageChange($event)"></app-pagination>

      <!-- Confirm Delete -->
      <app-confirm-dialog
        [visible]="deleteDialogVisible"
        title="Delete Media"
        message="Are you sure you want to permanently delete this file?"
        (confirmed)="deleteMedia()"
        (cancelled)="deleteDialogVisible = false">
      </app-confirm-dialog>
    </div>
  `,
  styles: [`
    .media-grid-page { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:14px; margin-bottom:20px; }
    .media-card { border-radius:12px; overflow:hidden; border:1px solid var(--border); background:var(--bg-card); transition:all 0.2s; }
    .media-card:hover { box-shadow:var(--shadow-md); transform:translateY(-2px); }
    .media-card-img { position:relative; aspect-ratio:1; overflow:hidden; background:var(--bg); }
    .media-card-img img { width:100%; height:100%; object-fit:cover; transition:transform 0.3s; }
    .media-card:hover img { transform:scale(1.05); }
    .media-card-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.2s; }
    .media-card:hover .media-card-overlay { opacity:1; }
    .media-card-info { padding:10px 12px; }
  `]
})
export class MediaListComponent implements OnInit {
  mediaList: Media[] = [];
  keyword = '';
  filterCategory = '';
  page = 0;
  totalPages = 0;
  loading = false;
  deleteDialogVisible = false;
  selectedMedia: Media | null = null;
  categories = ['general','project','service','gallery','team','client','review','about','settings'];
  private searchTimer: any;

  constructor(private apiService: ApiService, private toast: ToastService) {}

  ngOnInit() { this.loadMedia(); }

  loadMedia() {
    this.loading = true;
    const cat = this.filterCategory || undefined;
    this.apiService.getMediaList(cat, undefined, this.page, 20).subscribe({
      next: res => {
        this.mediaList = res.data?.content || [];
        this.totalPages = res.data?.totalPages || 0;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSearch() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.page = 0; this.loadMedia(); }, 400);
  }

  onUpload(event: any) {
    const files: File[] = Array.from(event.target.files);
    let completed = 0;
    files.forEach(file => {
      this.apiService.uploadMedia(file, this.filterCategory || 'general').subscribe({
        next: () => {
          completed++;
          if (completed === files.length) { this.toast.success(`${files.length} file(s) uploaded`); this.loadMedia(); }
        },
        error: () => this.toast.error('Upload failed for: ' + file.name)
      });
    });
  }

  confirmDelete(m: Media) { this.selectedMedia = m; this.deleteDialogVisible = true; }

  deleteMedia() {
    if (!this.selectedMedia) return;
    this.apiService.deleteMedia(this.selectedMedia.id).subscribe({
      next: () => { this.toast.success('Deleted'); this.loadMedia(); },
      error: () => this.toast.error('Delete failed')
    });
  }

  onPageChange(p: number) { this.page = p; this.loadMedia(); }
}
