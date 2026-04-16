import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({ selector: 'app-service-form', template: `
  <div>
    <div class="page-header"><div><h1 class="page-title">{{isEdit?'Edit':'New'}} Service</h1></div><button class="btn btn-ghost" routerLink="/services">← Back</button></div>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="grid-2" style="gap:24px;align-items:start">
        <div style="display:flex;flex-direction:column;gap:20px">
          <div class="card"><div class="card-body">
            <div class="form-group"><label class="form-label">Title <span class="required">*</span></label><input type="text" formControlName="title" class="form-control" [class.is-invalid]="submitted&&f['title'].errors" id="service-title" /><div class="form-error" *ngIf="submitted&&f['title'].errors?.['required']">Required</div></div>
            <div class="form-group"><label class="form-label">Description</label><textarea formControlName="description" class="form-control" rows="5" id="service-description"></textarea></div>
          </div></div>
          <div class="card"><div class="card-body">
            <div class="form-group"><label class="form-label">Status</label><select formControlName="status" class="form-select" id="service-status"><option value="published">Published</option><option value="draft">Draft</option></select></div>
            <div class="form-group"><label class="form-label">Display Order</label><input type="number" formControlName="displayOrder" class="form-control" /></div>
          </div></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:20px">
          <div class="card"><div class="card-body"><h3 style="font-size:14px;font-weight:700;margin-bottom:16px">Cover Image</h3><app-media-picker [mediaId]="form.get('coverMediaId')?.value" category="service" (mediaSelected)="form.patchValue({coverMediaId:$event})"></app-media-picker></div></div>
          <div class="card"><div class="card-body">
            <h3 style="font-size:14px;font-weight:700;margin-bottom:12px">Additional Images</h3>
            <div class="image-preview-grid" *ngIf="addImages.length"><div *ngFor="let img of addImages; let i=index" class="image-preview-item"><img [src]="img.url" /><button type="button" class="remove-btn" (click)="rmImg(i)">✕</button></div></div>
            <label class="btn btn-outline btn-sm" style="cursor:pointer;margin-top:10px">➕ Add Images<input type="file" multiple accept="image/*" (change)="onAdd($event)" style="display:none" /></label>
          </div></div>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:24px">
        <button type="button" class="btn btn-ghost" routerLink="/services">Cancel</button>
        <button type="submit" class="btn btn-primary" [disabled]="saving" id="save-service-btn">{{saving?'Saving...':(isEdit?'💾 Update':'➕ Create')}}</button>
      </div>
    </form>
  </div>
` })
export class ServiceFormComponent implements OnInit {
  form!: FormGroup; isEdit=false; saving=false; submitted=false;
  addImages: any[]=[];  addMediaIds: number[]=[];
  private id: number|null = null;
  constructor(private fb: FormBuilder, private api: ApiService, private toast: ToastService, private route: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.form = this.fb.group({ title:['',Validators.required], description:[''], coverMediaId:[null], status:['published'], displayOrder:[0] });
    this.id = this.route.snapshot.params['id'];
    if(this.id) { this.isEdit=true; this.api.getService(this.id).subscribe(r => { if(r.success){const s=r.data; this.form.patchValue({title:s.title,description:s.description,coverMediaId:s.coverMediaId,status:s.status,displayOrder:s.displayOrder}); if(s.images){this.addImages=s.images;this.addMediaIds=s.images.map((i:any)=>i.id);} } }); }
  }
  get f(){return this.form.controls;}
  onAdd(ev:any){const files:File[]=Array.from(ev.target.files);files.forEach(f=>this.api.uploadMedia(f,'service').subscribe(r=>{if(r.success){this.addImages.push(r.data);this.addMediaIds.push(r.data.id);}}));}
  rmImg(i:number){this.addImages.splice(i,1);this.addMediaIds.splice(i,1);}
  submit(){this.submitted=true;if(this.form.invalid)return;this.saving=true;const payload={...this.form.value,imageMediaIds:this.addMediaIds};const obs=this.isEdit?this.api.updateService(this.id!,payload):this.api.createService(payload);obs.subscribe({next:()=>{this.toast.success(this.isEdit?'Updated!':'Created!');this.router.navigate(['/services']);},error:err=>{this.toast.error(err.error?.message||'Error');this.saving=false;}});}
}
