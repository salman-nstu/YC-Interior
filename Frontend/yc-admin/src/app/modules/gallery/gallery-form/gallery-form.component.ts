import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({ selector: 'app-gallery-form', template: `
  <div>
    <div class="page-header"><div><h1 class="page-title">{{isEdit?'Edit':'Add'}} Gallery Item</h1></div><button class="btn btn-ghost" routerLink="/gallery">← Back</button></div>
    <form [formGroup]="form" (ngSubmit)="submit()" style="max-width:560px">
      <div class="card"><div class="card-body" style="display:flex;flex-direction:column;gap:16px">
        <div class="form-group"><label class="form-label">Title</label><input type="text" formControlName="title" class="form-control" placeholder="Optional title" id="gallery-title" /></div>
        <div class="form-group"><label class="form-label">Image <span class="required">*</span></label><app-media-picker [mediaId]="form.get('mediaId')?.value" category="gallery" (mediaSelected)="form.patchValue({mediaId:$event})"></app-media-picker><div class="form-error" *ngIf="submitted&&form.get('mediaId')?.errors?.['required']">Image is required</div></div>
        <div class="form-group"><label class="form-label">Display Order</label><input type="number" formControlName="displayOrder" class="form-control" /></div>
        <label class="toggle-wrap"><div class="toggle"><input type="checkbox" formControlName="isFeatured" id="gallery-featured" /><span class="slider"></span></div><span style="font-size:13px;font-weight:500">Featured ⭐</span></label>
        <div class="flex gap-8 mt-0" style="justify-content:flex-end">
          <button type="button" class="btn btn-ghost" routerLink="/gallery">Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="saving" id="save-gallery-btn">{{saving?'Saving...':(isEdit?'💾 Update':'➕ Add')}}</button>
        </div>
      </div></div>
    </form>
  </div>
` })
export class GalleryFormComponent implements OnInit {
  form!: FormGroup; isEdit=false; saving=false; submitted=false; private id:number|null=null;
  constructor(private fb:FormBuilder, private api:ApiService, private toast:ToastService, private route:ActivatedRoute, private router:Router){}
  ngOnInit(){
    this.form=this.fb.group({title:[''],mediaId:[null,Validators.required],displayOrder:[0],isFeatured:[false]});
    this.id=this.route.snapshot.params['id'];
    if(this.id){this.isEdit=true;this.api.getGallery(undefined,undefined,0,1000).subscribe(r=>{const g=r.data?.content?.find((x:any)=>x.id===+this.id!);if(g)this.form.patchValue({title:g.title,mediaId:g.mediaId,displayOrder:g.displayOrder,isFeatured:g.isFeatured});});}
  }
  submit(){this.submitted=true;if(this.form.invalid)return;this.saving=true;const obs=this.isEdit?this.api.updateGallery(this.id!,this.form.value):this.api.createGallery(this.form.value);obs.subscribe({next:()=>{this.toast.success(this.isEdit?'Updated!':'Added!');this.router.navigate(['/gallery']);},error:err=>{this.toast.error(err.error?.message||'Error');this.saving=false;}});}
}
