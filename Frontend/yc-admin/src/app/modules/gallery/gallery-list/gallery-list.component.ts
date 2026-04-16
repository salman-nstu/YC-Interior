import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Gallery } from '../../../core/models/models';

@Component({ selector: 'app-gallery-list', template: `
  <div>
    <div class="page-header"><div><h1 class="page-title">Gallery</h1><p class="page-subtitle">Manage gallery images (max 8 featured)</p></div><button class="btn btn-primary" routerLink="/gallery/new" id="add-gallery-btn">➕ Add Image</button></div>
    <div class="card" style="margin-bottom:20px"><div class="card-body" style="display:flex;gap:12px;padding:16px 20px">
      <div class="search-bar" style="flex:1"><span class="search-icon">🔍</span><input class="form-control" [(ngModel)]="keyword" (input)="onSearch()" placeholder="Search gallery..." id="gallery-search" /></div>
      <select class="form-select" [(ngModel)]="featuredFilter" (change)="load()" style="width:160px" id="gallery-featured-filter"><option value="">All</option><option value="true">Featured Only</option><option value="false">Not Featured</option></select>
    </div></div>
    <div class="gallery-grid">
      <div *ngFor="let g of items" class="gallery-card">
        <div class="gallery-card-img"><img [src]="g.media?.url" [alt]="g.title" loading="lazy" />
          <div class="gallery-overlay">
            <button class="btn-icon" [routerLink]="['/gallery/edit', g.id]" [id]="'edit-gallery-'+g.id">✏️</button>
            <button class="btn-icon danger" (click)="remove(g)" [id]="'delete-gallery-'+g.id">🗑️</button>
          </div>
        </div>
        <div class="gallery-card-foot">
          <span class="truncate" style="font-size:12px;font-weight:500">{{g.title||'Untitled'}}</span>
          <button class="featured-toggle" [class.active]="g.isFeatured" (click)="toggleFeatured(g)" [id]="'featured-gallery-'+g.id">{{g.isFeatured?'⭐':'☆'}}</button>
        </div>
      </div>
      <div *ngIf="!items.length" class="empty-state" style="grid-column:1/-1;padding:60px"><div class="empty-icon">🎨</div><p class="empty-title">No gallery images yet</p></div>
    </div>
    <app-pagination [totalPages]="totalPages" [currentPage]="page" (pageChange)="onPageChange($event)"></app-pagination>
    <app-confirm-dialog [visible]="deleteVisible" title="Delete Gallery Item" message="Delete this gallery item?" (confirmed)="doDelete()" (cancelled)="deleteVisible=false"></app-confirm-dialog>
  </div>
`, styles: [`.gallery-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px}.gallery-card{border-radius:12px;overflow:hidden;border:1px solid var(--border);background:var(--bg-card)}.gallery-card-img{position:relative;aspect-ratio:4/3;overflow:hidden;background:var(--bg)}.gallery-card-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.3s}.gallery-card:hover img{transform:scale(1.05)}.gallery-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;gap:8px;opacity:0;transition:opacity 0.2s}.gallery-card:hover .gallery-overlay{opacity:1}.gallery-card-foot{display:flex;align-items:center;justify-content:space-between;padding:10px 12px}.featured-toggle{background:none;border:none;font-size:18px;cursor:pointer;transition:transform 0.2s}.featured-toggle.active{color:#F0A500}`] })
export class GalleryListComponent implements OnInit {
  items: Gallery[]=[]; keyword=''; featuredFilter=''; page=0; totalPages=0;
  deleteVisible=false; selected:Gallery|null=null; private t:any;
  constructor(private api:ApiService, private toast:ToastService){}
  ngOnInit(){this.load();}
  load(){const f=this.featuredFilter===''?undefined:this.featuredFilter==='true';this.api.getGallery(this.keyword||undefined,f,this.page,12).subscribe(r=>{this.items=r.data?.content||[];this.totalPages=r.data?.totalPages||0;});}
  onSearch(){clearTimeout(this.t);this.t=setTimeout(()=>{this.page=0;this.load();},400);}
  onPageChange(p:number){this.page=p;this.load();}
  toggleFeatured(g:Gallery){this.api.setGalleryFeatured(g.id,!g.isFeatured).subscribe({next:()=>{g.isFeatured=!g.isFeatured;this.toast.success('Updated');},error:err=>this.toast.error(err.error?.message||'Error')});}
  remove(g:Gallery){this.selected=g;this.deleteVisible=true;}
  doDelete(){if(!this.selected)return;this.api.deleteGallery(this.selected.id).subscribe({next:()=>{this.toast.success('Deleted');this.load();},error:()=>this.toast.error('Error')});}
}
