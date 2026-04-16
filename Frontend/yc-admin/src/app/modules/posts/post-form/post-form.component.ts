import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({ selector: 'app-post-form', template: `
  <div>
    <div class="page-header"><div><h1 class="page-title">{{isEdit?'Edit':'New'}} Post</h1></div><button class="btn btn-ghost" routerLink="/posts">← Back</button></div>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="grid-2" style="gap:24px;align-items:start">
        <div style="display:flex;flex-direction:column;gap:20px">
          <div class="card"><div class="card-body">
            <div class="form-group"><label class="form-label">Title <span class="required">*</span></label><input formControlName="title" class="form-control" [class.is-invalid]="submitted&&f['title'].errors" id="post-title" /></div>
            <div class="form-group"><label class="form-label">Slug</label><input formControlName="slug" class="form-control" placeholder="auto-generated if empty" id="post-slug" /></div>
            <div class="form-group"><label class="form-label">Content / Description</label><textarea formControlName="description" class="form-control" rows="10" id="post-content"></textarea></div>
          </div></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:20px">
          <div class="card"><div class="card-body"><h3 style="font-size:14px;font-weight:700;margin-bottom:16px">Cover Image</h3><app-media-picker [mediaId]="form.get('coverMediaId')?.value" category="general" (mediaSelected)="form.patchValue({coverMediaId:$event})"></app-media-picker></div></div>
          <div class="card"><div class="card-body">
            <div class="form-group"><label class="form-label">Category</label><select formControlName="categoryId" class="form-select" id="post-category"><option value="">—</option><option *ngFor="let c of categories" [value]="c.id">{{c.name}}</option></select></div>
            <div class="form-group"><label class="form-label">Status</label><select formControlName="status" class="form-select" id="post-status"><option value="published">Published</option><option value="draft">Draft</option></select></div>
          </div></div>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:24px"><button type="button" class="btn btn-ghost" routerLink="/posts">Cancel</button><button type="submit" class="btn btn-primary" [disabled]="saving" id="save-post-btn">{{saving?'Saving...':(isEdit?'💾 Update':'➕ Create')}}</button></div>
    </form>
  </div>
` })
export class PostFormComponent implements OnInit {
  form!:FormGroup; isEdit=false; saving=false; submitted=false; categories:any[]=[]; private id:number|null=null;
  constructor(private fb:FormBuilder,private api:ApiService,private toast:ToastService,private route:ActivatedRoute,private router:Router){}
  ngOnInit(){
    this.form=this.fb.group({title:['',Validators.required],slug:[''],description:[''],coverMediaId:[null],categoryId:[''],status:['published']});
    this.api.getPostCategoriesList().subscribe(r=>this.categories=r.data||[]);
    this.id=this.route.snapshot.params['id'];
    if(this.id){this.isEdit=true;this.api.getPosts(undefined,undefined,undefined,0,100).subscribe(r=>{const p=r.data?.content?.find((x:any)=>x.id===+this.id!);if(p)this.form.patchValue({title:p.title,slug:p.slug,description:p.description,coverMediaId:p.coverMediaId,categoryId:p.categoryId,status:p.status});});}
  }
  get f(){return this.form.controls;}
  submit(){this.submitted=true;if(this.form.invalid)return;this.saving=true;const payload={...this.form.value,categoryId:this.form.value.categoryId||null};const obs=this.isEdit?this.api.updatePost(this.id!,payload):this.api.createPost(payload);obs.subscribe({next:()=>{this.toast.success(this.isEdit?'Updated!':'Created!');this.router.navigate(['/posts']);},error:err=>{this.toast.error(err.error?.message||'Error');this.saving=false;}});}
}
