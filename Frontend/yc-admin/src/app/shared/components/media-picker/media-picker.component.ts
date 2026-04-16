import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Media } from '../../../core/models/models';

@Component({
  selector: 'app-media-picker',
  template: `
    <div>
      <!-- Selected Preview -->
      <div *ngIf="selectedMedia" class="selected-preview">
        <img [src]="selectedMedia.url" [alt]="selectedMedia.altText || selectedMedia.fileName" class="thumb-lg" />
        <div class="selected-info">
          <p class="font-medium" style="font-size:13px">{{selectedMedia.fileName}}</p>
          <p class="text-muted" style="font-size:11px">{{selectedMedia.mimeType}}</p>
        </div>
        <button class="btn btn-ghost btn-sm" (click)="clearSelection()">✕ Remove</button>
      </div>

      <button type="button" class="btn btn-outline btn-sm" (click)="openPicker()">
        🖼️ {{selectedMedia ? 'Change Image' : 'Select Image'}}
      </button>

      <!-- Upload inline -->
      <div class="upload-inline" style="margin-top:10px">
        <input type="file" #fileInput (change)="onFileChange($event)" accept="image/*" style="display:none" />
        <button type="button" class="btn btn-ghost btn-sm" (click)="fileInput.click()">📤 Upload New</button>
      </div>

      <!-- Picker Modal -->
      <div class="modal-backdrop" *ngIf="pickerOpen" (click)="pickerOpen = false">
        <div class="modal modal-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Media Library</h3>
            <button class="btn-icon" (click)="pickerOpen = false">✕</button>
          </div>
          <div class="modal-body">
            <div style="margin-bottom:14px;display:flex;gap:10px">
              <input class="form-control" [(ngModel)]="searchTerm" placeholder="Search..." style="flex:1" />
              <select class="form-select" [(ngModel)]="filterCategory" style="width:160px" (change)="loadMedia()">
                <option value="">All Categories</option>
                <option *ngFor="let cat of categories" [value]="cat">{{cat}}</option>
              </select>
            </div>
            <div class="media-grid">
              <div *ngFor="let m of mediaList" class="media-item"
                   [class.selected]="selectedId === m.id"
                   (click)="selectMedia(m)">
                <img [src]="m.url" [alt]="m.altText || m.fileName" />
                <div class="media-item-name">{{m.fileName}}</div>
              </div>
              <div *ngIf="!mediaList.length" class="empty-state" style="grid-column:1/-1;padding:40px">
                <div class="empty-icon">🖼️</div>
                <p class="empty-title">No media found</p>
              </div>
            </div>
            <app-pagination [totalPages]="totalPages" [currentPage]="page" (pageChange)="onPageChange($event)"></app-pagination>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" (click)="pickerOpen = false">Cancel</button>
            <button class="btn btn-primary" (click)="confirmSelection()" [disabled]="!selectedId">Select</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .selected-preview { display:flex; align-items:center; gap:14px; padding:12px; background:var(--bg); border-radius:10px; border:1px solid var(--border); margin-bottom:10px; }
    .selected-info { flex:1; }
    .media-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(110px,1fr)); gap:10px; max-height:380px; overflow-y:auto; }
    .media-item { border-radius:8px; overflow:hidden; border:2px solid var(--border); cursor:pointer; transition:all 0.2s; position:relative; aspect-ratio:1; }
    .media-item img { width:100%; height:100%; object-fit:cover; }
    .media-item-name { position:absolute; bottom:0; left:0; right:0; padding:4px 6px; background:rgba(0,0,0,0.6); color:white; font-size:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .media-item:hover { border-color:var(--primary); transform:scale(1.02); }
    .media-item.selected { border-color:var(--primary); box-shadow:0 0 0 3px rgba(92,122,78,0.3); }
  `]
})
export class MediaPickerComponent implements OnInit {
  @Input() mediaId: number | null = null;
  @Input() category = '';
  @Output() mediaSelected = new EventEmitter<number | null>();

  selectedMedia: Media | null = null;
  selectedId: number | null = null;
  pickerOpen = false;
  mediaList: Media[] = [];
  searchTerm = '';
  filterCategory = '';
  page = 0;
  totalPages = 0;
  categories = ['general','project','service','gallery','team','client','review','about','settings'];
  uploading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    if (this.mediaId) {
      this.apiService.getMediaList(undefined, undefined, 0, 100).subscribe(res => {
        const found = res.data?.content?.find((m: Media) => m.id === this.mediaId);
        if (found) { this.selectedMedia = found; this.selectedId = found.id; }
      });
    }
    if (this.category) this.filterCategory = this.category;
  }

  openPicker() { this.pickerOpen = true; this.loadMedia(); }

  loadMedia() {
    const cat = this.filterCategory || undefined;
    this.apiService.getMediaList(cat, undefined, this.page, 24).subscribe(res => {
      this.mediaList = res.data?.content || [];
      this.totalPages = res.data?.totalPages || 0;
    });
  }

  selectMedia(m: Media) { this.selectedId = m.id; }

  confirmSelection() {
    const m = this.mediaList.find(x => x.id === this.selectedId);
    if (m) { this.selectedMedia = m; this.mediaSelected.emit(m.id); }
    this.pickerOpen = false;
  }

  clearSelection() { this.selectedMedia = null; this.selectedId = null; this.mediaSelected.emit(null); }

  onPageChange(p: number) { this.page = p; this.loadMedia(); }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const cat = this.filterCategory || 'general';
    this.apiService.uploadMedia(file, cat).subscribe(res => {
      if (res.success) {
        this.selectedMedia = res.data;
        this.selectedId = res.data.id;
        this.mediaSelected.emit(res.data.id);
      }
    });
  }
}
