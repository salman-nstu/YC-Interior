import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Review } from '../../core/models/models';

@Component({ selector: 'app-reviews', template: `
  <div>
    <div class="page-header"><div><h1 class="page-title">Reviews</h1><p class="page-subtitle">Customer reviews (max 6 featured)</p></div><button class="btn btn-primary" (click)="openForm()" id="add-review-btn">➕ Add Review</button></div>
    <div class="card" style="margin-bottom:20px"><div class="card-body" style="display:flex;gap:12px;padding:14px 20px">
      <div class="search-bar" style="flex:1"><span class="search-icon">🔍</span><input class="form-control" [(ngModel)]="keyword" (input)="onSearch()" placeholder="Search reviews..." id="reviews-search" /></div>
      <select class="form-select" [(ngModel)]="featuredFilter" (change)="load()" style="width:150px" id="reviews-featured-filter"><option value="">All</option><option value="true">Featured</option><option value="false">Not Featured</option></select>
    </div></div>
    <div class="card">
      <div class="table-container">
        <table class="table">
          <thead><tr><th>Avatar</th><th>Name</th><th>Rating</th><th>Review</th><th>Featured</th><th>Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of reviews">
              <td><img [src]="r.media?.url" class="thumb-sm" style="border-radius:50%" *ngIf="r.media" /><div *ngIf="!r.media" style="width:32px;height:32px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700">{{r.name[0]}}</div></td>
              <td><p class="font-semibold" style="font-size:13px">{{r.name}}</p><p class="text-muted" style="font-size:11px">{{r.designation}}</p></td>
              <td><span class="stars">{{getStars(r.rating)}}</span></td>
              <td style="max-width:250px"><p style="font-size:12px;color:var(--text-secondary)">{{r.description|slice:0:80}}...</p></td>
              <td><button class="featured-toggle" [class.active]="r.isFeatured" (click)="toggleFeatured(r)" [id]="'featured-review-'+r.id">{{r.isFeatured?'⭐':'☆'}}</button></td>
              <td><div class="flex gap-8"><button class="btn-icon" (click)="edit(r)" [id]="'edit-review-'+r.id">✏️</button><button class="btn-icon danger" (click)="remove(r.id)" [id]="'delete-review-'+r.id">🗑️</button></div></td>
            </tr>
            <tr *ngIf="!reviews.length"><td colspan="6" class="empty-state" style="padding:40px"><div class="empty-icon">⭐</div><p class="empty-title">No reviews yet</p></td></tr>
          </tbody>
        </table>
      </div>
      <app-pagination [totalPages]="totalPages" [currentPage]="page" (pageChange)="onPageChange($event)"></app-pagination>
    </div>

    <div class="modal-backdrop" *ngIf="modalOpen" (click)="closeForm()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header"><h3 class="modal-title">{{editId?'Edit':'Add'}} Review</h3><button class="btn-icon" (click)="closeForm()">✕</button></div>
        <div class="modal-body"><form [formGroup]="form">
          <div class="grid-2" style="gap:14px"><div class="form-group"><label class="form-label">Name <span class="required">*</span></label><input formControlName="name" class="form-control" id="review-name" /></div><div class="form-group"><label class="form-label">Designation</label><input formControlName="designation" class="form-control" /></div></div>
          <div class="form-group"><label class="form-label">Rating (1-5)</label><input type="number" formControlName="rating" class="form-control" min="1" max="5" id="review-rating" /></div>
          <div class="form-group"><label class="form-label">Review Text</label><textarea formControlName="description" class="form-control" rows="4" id="review-text"></textarea></div>
          <div class="form-group"><label class="form-label">Avatar Photo</label><app-media-picker [mediaId]="form.get('mediaId')?.value" category="review" (mediaSelected)="form.patchValue({mediaId:$event})"></app-media-picker></div>
          <label class="toggle-wrap"><div class="toggle"><input type="checkbox" formControlName="isFeatured" id="review-featured" /><span class="slider"></span></div><span style="font-size:13px">Featured ⭐</span></label>
        </form></div>
        <div class="modal-footer"><button class="btn btn-ghost" (click)="closeForm()">Cancel</button><button class="btn btn-primary" (click)="submit()" [disabled]="saving" id="save-review-btn">{{saving?'Saving...':'Save'}}</button></div>
      </div>
    </div>
  </div>
`, styles:[`.featured-toggle{background:none;border:none;font-size:20px;cursor:pointer;transition:transform 0.2s;padding:4px}.featured-toggle.active{color:#F0A500}.featured-toggle:hover{transform:scale(1.3)}`] })
export class ReviewsComponent implements OnInit {
  reviews:Review[]=[]; form!:FormGroup; modalOpen=false; editId:number|null=null; saving=false;
  keyword=''; featuredFilter=''; page=0; totalPages=0; private t:any;
  constructor(private fb:FormBuilder,private api:ApiService,private toast:ToastService){}
  ngOnInit(){this.initForm();this.load();}
  initForm(){this.form=this.fb.group({name:['',Validators.required],designation:[''],rating:[5,Validators.required],description:[''],mediaId:[null],isFeatured:[true]});}
  load(){const f=this.featuredFilter===''?undefined:this.featuredFilter==='true';this.api.getReviews(this.keyword||undefined,f,this.page).subscribe(r=>{this.reviews=r.data?.content||[];this.totalPages=r.data?.totalPages||0;});}
  onSearch(){clearTimeout(this.t);this.t=setTimeout(()=>{this.page=0;this.load();},400);}
  onPageChange(p:number){this.page=p;this.load();}
  openForm(){this.editId=null;this.initForm();this.modalOpen=true;}
  edit(r:Review){this.editId=r.id;this.form.patchValue(r);this.modalOpen=true;}
  closeForm(){this.modalOpen=false;}
  toggleFeatured(r:Review){this.api.setReviewFeatured(r.id,!r.isFeatured).subscribe({next:()=>{r.isFeatured=!r.isFeatured;this.toast.success('Updated');},error:err=>this.toast.error(err.error?.message||'Error')});}
  submit(){if(this.form.invalid){this.toast.warning('Name required');return;}this.saving=true;const obs=this.editId?this.api.updateReview(this.editId,this.form.value):this.api.createReview(this.form.value);obs.subscribe({next:()=>{this.toast.success('Saved!');this.closeForm();this.load();this.saving=false;},error:err=>{this.toast.error(err.error?.message||'Error');this.saving=false;}});}
  remove(id:number){if(!confirm('Delete?'))return;this.api.deleteReview(id).subscribe({next:()=>{this.toast.success('Deleted');this.load();},error:()=>this.toast.error('Error')});}
  getStars(r:number){return '★'.repeat(r)+'☆'.repeat(5-r);}
}
