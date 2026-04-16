import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { PostCategory } from '../../../core/models/models';

@Component({ selector: 'app-post-categories', template: `
  <div>
    <div class="page-header"><div><h1 class="page-title">Post Categories</h1></div><button class="btn btn-ghost" routerLink="/posts">← Back to Posts</button></div>
    <div class="grid-2" style="gap:24px;align-items:start">
      <div class="card"><div class="card-body">
        <h3 style="font-size:14px;font-weight:700;margin-bottom:16px">{{editId?'Edit':'New'}} Category</h3>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-group"><label class="form-label">Name <span class="required">*</span></label><input formControlName="name" class="form-control" id="post-cat-name" /></div>
          <div class="flex gap-8"><button type="submit" class="btn btn-primary btn-sm">{{editId?'Update':'Create'}}</button><button type="button" class="btn btn-ghost btn-sm" *ngIf="editId" (click)="cancel()">Cancel</button></div>
        </form>
      </div></div>
      <div class="card"><div class="table-container"><table class="table"><thead><tr><th>Name</th><th>Created</th><th>Actions</th></tr></thead>
        <tbody>
          <tr *ngFor="let c of categories"><td class="font-semibold" style="font-size:13px">{{c.name}}</td><td class="text-muted" style="font-size:12px">{{c.createdAt|date}}</td>
            <td><div class="flex gap-8"><button class="btn-icon" (click)="edit(c)" [id]="'edit-pcat-'+c.id">✏️</button><button class="btn-icon danger" (click)="remove(c.id)" [id]="'delete-pcat-'+c.id">🗑️</button></div></td>
          </tr>
        </tbody>
      </table></div></div>
    </div>
  </div>
` })
export class PostCategoriesComponent implements OnInit {
  form!:FormGroup; categories:PostCategory[]=[]; editId:number|null=null; submitted=false;
  constructor(private fb:FormBuilder,private api:ApiService,private toast:ToastService){}
  ngOnInit(){this.form=this.fb.group({name:['',Validators.required]});this.load();}
  load(){this.api.getPostCategoriesList().subscribe(r=>this.categories=r.data||[]);}
  submit(){this.submitted=true;if(this.form.invalid)return;const obs=this.editId?this.api.updatePostCategory(this.editId,this.form.value):this.api.createPostCategory(this.form.value);obs.subscribe({next:()=>{this.toast.success(this.editId?'Updated':'Created');this.form.reset();this.editId=null;this.submitted=false;this.load();},error:err=>this.toast.error(err.error?.message||'Error')});}
  edit(c:PostCategory){this.editId=c.id;this.form.patchValue({name:c.name});}
  cancel(){this.editId=null;this.form.reset();}
  remove(id:number){if(!confirm('Delete?'))return;this.api.deletePostCategory(id).subscribe({next:()=>{this.toast.success('Deleted');this.load();},error:()=>this.toast.error('Error')});}
}
