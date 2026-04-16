import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { AboutSection } from '../../../core/models/models';

@Component({ selector: 'app-about-list', template: `
  <div>
    <div class="page-header"><div><h1 class="page-title">About Sections</h1><p class="page-subtitle">Manage about page content</p></div><button class="btn btn-primary" (click)="openForm()" id="add-about-btn">➕ Add Section</button></div>
    <div class="card">
      <div class="table-container">
        <table class="table">
          <thead><tr><th>Image</th><th>Title</th><th>Order</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let a of sections">
              <td><img [src]="a.media?.url" class="thumb-sm" *ngIf="a.media" /></td>
              <td><p class="font-semibold" style="font-size:13px">{{a.title}}</p></td>
              <td>{{a.displayOrder}}</td>
              <td><span class="badge" [class.badge-success]="a.isActive" [class.badge-muted]="!a.isActive">{{a.isActive?'Active':'Inactive'}}</span></td>
              <td><div class="flex gap-8"><button class="btn-icon" (click)="edit(a)" [id]="'edit-about-'+a.id">✏️</button><button class="btn-icon danger" (click)="remove(a.id)" [id]="'delete-about-'+a.id">🗑️</button></div></td>
            </tr>
            <tr *ngIf="!sections.length"><td colspan="5" class="empty-state" style="padding:40px"><div class="empty-icon">📋</div><p class="empty-title">No sections yet</p></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div class="modal-backdrop" *ngIf="modalOpen" (click)="closeForm()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header"><h3 class="modal-title">{{editId?'Edit':'Add'}} Section</h3><button class="btn-icon" (click)="closeForm()">✕</button></div>
        <div class="modal-body">
          <form [formGroup]="form">
            <div class="form-group"><label class="form-label">Title</label><input formControlName="title" class="form-control" id="about-title" /></div>
            <div class="form-group"><label class="form-label">Description</label><textarea formControlName="description" class="form-control" rows="4" id="about-description"></textarea></div>
            <div class="form-group"><label class="form-label">Image</label><app-media-picker [mediaId]="form.get('mediaId')?.value" category="about" (mediaSelected)="form.patchValue({mediaId:$event})"></app-media-picker></div>
            <div class="form-group"><label class="form-label">Display Order</label><input type="number" formControlName="displayOrder" class="form-control" /></div>
            <label class="toggle-wrap"><div class="toggle"><input type="checkbox" formControlName="isActive" /><span class="slider"></span></div><span style="font-size:13px">Active</span></label>
          </form>
        </div>
        <div class="modal-footer"><button class="btn btn-ghost" (click)="closeForm()">Cancel</button><button class="btn btn-primary" (click)="submit()" [disabled]="saving" id="save-about-btn">{{saving?'Saving...':'Save'}}</button></div>
      </div>
    </div>
  </div>
` })
export class AboutListComponent implements OnInit {
  sections: AboutSection[] = []; form!: FormGroup; modalOpen=false; editId:number|null=null; saving=false;
  constructor(private fb: FormBuilder, private api: ApiService, private toast: ToastService) {}
  ngOnInit() { this.initForm(); this.load(); }
  initForm() { this.form = this.fb.group({ title:['',Validators.required], description:[''], mediaId:[null], displayOrder:[0], isActive:[true] }); }
  load() { this.api.getAboutSections().subscribe(r => this.sections = r.data?.content||[]); }
  openForm() { this.editId=null; this.initForm(); this.modalOpen=true; }
  edit(a: AboutSection) { this.editId=a.id; this.form.patchValue({title:a.title,description:a.description,mediaId:a.mediaId,displayOrder:a.displayOrder,isActive:a.isActive}); this.modalOpen=true; }
  closeForm() { this.modalOpen=false; }
  submit() {
    if(this.form.invalid){this.toast.warning('Title is required');return;}
    this.saving=true;
    const obs=this.editId?this.api.updateAboutSection(this.editId,this.form.value):this.api.createAboutSection(this.form.value);
    obs.subscribe({next:()=>{this.toast.success(this.editId?'Updated!':'Created!');this.closeForm();this.load();this.saving=false;},error:err=>{this.toast.error(err.error?.message||'Error');this.saving=false;}});
  }
  remove(id: number) { if(!confirm('Delete?'))return; this.api.deleteAboutSection(id).subscribe({next:()=>{this.toast.success('Deleted');this.load();},error:()=>this.toast.error('Error')}); }
}
