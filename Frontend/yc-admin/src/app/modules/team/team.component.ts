import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { TeamMember } from '../../core/models/models';

@Component({ selector: 'app-team', template: `
  <div>
    <div class="page-header"><div><h1 class="page-title">Team Members</h1><p class="page-subtitle">Manage your team</p></div><button class="btn btn-primary" (click)="openForm()" id="add-team-btn">➕ Add Member</button></div>
    <div class="team-grid">
      <div *ngFor="let m of members" class="team-card">
        <div class="team-avatar"><img [src]="m.media?.url" [alt]="m.name" *ngIf="m.media" /><div class="team-initials" *ngIf="!m.media">{{m.name[0]}}</div></div>
        <p class="team-name">{{m.name}}</p>
        <p class="team-designation">{{m.designation}}</p>
        <div class="team-actions"><button class="btn-icon" (click)="edit(m)" [id]="'edit-team-'+m.id">✏️</button><button class="btn-icon danger" (click)="remove(m.id)" [id]="'delete-team-'+m.id">🗑️</button></div>
      </div>
      <div *ngIf="!members.length" class="empty-state" style="grid-column:1/-1"><div class="empty-icon">👥</div><p class="empty-title">No team members yet</p></div>
    </div>
    <app-pagination [totalPages]="totalPages" [currentPage]="page" (pageChange)="onPageChange($event)"></app-pagination>

    <div class="modal-backdrop" *ngIf="modalOpen" (click)="closeForm()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header"><h3 class="modal-title">{{editId?'Edit':'Add'}} Team Member</h3><button class="btn-icon" (click)="closeForm()">✕</button></div>
        <div class="modal-body"><form [formGroup]="form">
          <div class="form-group"><label class="form-label">Name <span class="required">*</span></label><input formControlName="name" class="form-control" id="team-name" /></div>
          <div class="form-group"><label class="form-label">Designation</label><input formControlName="designation" class="form-control" /></div>
          <div class="form-group"><label class="form-label">Photo</label><app-media-picker [mediaId]="form.get('mediaId')?.value" category="team" (mediaSelected)="form.patchValue({mediaId:$event})"></app-media-picker></div>
          <div class="form-group"><label class="form-label">Display Order</label><input type="number" formControlName="displayOrder" class="form-control" /></div>
        </form></div>
        <div class="modal-footer"><button class="btn btn-ghost" (click)="closeForm()">Cancel</button><button class="btn btn-primary" (click)="submit()" [disabled]="saving" id="save-team-btn">{{saving?'Saving...':'Save'}}</button></div>
      </div>
    </div>
  </div>
`, styles:[`.team-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px;margin-bottom:20px}.team-card{background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:24px 16px;text-align:center;transition:all 0.2s}.team-card:hover{box-shadow:var(--shadow-md);transform:translateY(-2px)}.team-avatar{width:80px;height:80px;border-radius:50%;overflow:hidden;margin:0 auto 12px;border:3px solid var(--accent)}.team-avatar img{width:100%;height:100%;object-fit:cover}.team-initials{width:100%;height:100%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700}.team-name{font-size:14px;font-weight:700}.team-designation{font-size:12px;color:var(--text-muted);margin:4px 0 12px}.team-actions{display:flex;justify-content:center;gap:8px}`] })
export class TeamComponent implements OnInit {
  members:TeamMember[]=[]; form!:FormGroup; modalOpen=false; editId:number|null=null; saving=false; page=0; totalPages=0;
  constructor(private fb:FormBuilder,private api:ApiService,private toast:ToastService){}
  ngOnInit(){this.initForm();this.load();}
  initForm(){this.form=this.fb.group({name:['',Validators.required],designation:[''],mediaId:[null],displayOrder:[0]});}
  load(){this.api.getTeamMembers(undefined,this.page).subscribe(r=>{this.members=r.data?.content||[];this.totalPages=r.data?.totalPages||0;});}
  onPageChange(p:number){this.page=p;this.load();}
  openForm(){this.editId=null;this.initForm();this.modalOpen=true;}
  edit(m:TeamMember){this.editId=m.id;this.form.patchValue(m);this.modalOpen=true;}
  closeForm(){this.modalOpen=false;}
  submit(){if(this.form.invalid){this.toast.warning('Name required');return;}this.saving=true;const obs=this.editId?this.api.updateTeamMember(this.editId,this.form.value):this.api.createTeamMember(this.form.value);obs.subscribe({next:()=>{this.toast.success('Saved!');this.closeForm();this.load();this.saving=false;},error:()=>{this.toast.error('Error');this.saving=false;}});}
  remove(id:number){if(!confirm('Delete?'))return;this.api.deleteTeamMember(id).subscribe({next:()=>{this.toast.success('Deleted');this.load();},error:()=>this.toast.error('Error')});}
}
