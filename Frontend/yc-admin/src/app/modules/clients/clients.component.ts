import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Client } from '../../core/models/models';

@Component({ selector: 'app-clients', template: `
  <div>
    <div class="page-header"><div><h1 class="page-title">Clients</h1><p class="page-subtitle">Manage client logos</p></div><button class="btn btn-primary" (click)="openForm()" id="add-client-btn">➕ Add Client</button></div>
    <div class="clients-grid">
      <div *ngFor="let c of clients" class="client-card">
        <img [src]="c.logoMedia?.url" [alt]="c.name" class="client-logo" *ngIf="c.logoMedia" />
        <div *ngIf="!c.logoMedia" class="client-logo-placeholder">🤝</div>
        <p class="client-name">{{c.name}}</p>
        <div class="client-actions">
          <button class="btn-icon" (click)="edit(c)" [id]="'edit-client-'+c.id">✏️</button>
          <button class="btn-icon danger" (click)="remove(c.id)" [id]="'delete-client-'+c.id">🗑️</button>
        </div>
      </div>
      <div *ngIf="!clients.length" class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🤝</div><p class="empty-title">No clients yet</p></div>
    </div>
    <app-pagination [totalPages]="totalPages" [currentPage]="page" (pageChange)="onPageChange($event)"></app-pagination>

    <div class="modal-backdrop" *ngIf="modalOpen" (click)="closeForm()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header"><h3 class="modal-title">{{editId?'Edit':'Add'}} Client</h3><button class="btn-icon" (click)="closeForm()">✕</button></div>
        <div class="modal-body"><form [formGroup]="form">
          <div class="form-group"><label class="form-label">Name <span class="required">*</span></label><input formControlName="name" class="form-control" id="client-name" /></div>
          <div class="form-group"><label class="form-label">Logo</label><app-media-picker [mediaId]="form.get('logoMediaId')?.value" category="client" (mediaSelected)="form.patchValue({logoMediaId:$event})"></app-media-picker></div>
          <div class="form-group"><label class="form-label">Display Order</label><input type="number" formControlName="displayOrder" class="form-control" /></div>
        </form></div>
        <div class="modal-footer"><button class="btn btn-ghost" (click)="closeForm()">Cancel</button><button class="btn btn-primary" (click)="submit()" [disabled]="saving" id="save-client-btn">{{saving?'Saving...':'Save'}}</button></div>
      </div>
    </div>
  </div>
`, styles:[`.clients-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;margin-bottom:20px}.client-card{background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:20px;text-align:center;transition:all 0.2s}.client-card:hover{box-shadow:var(--shadow-md);transform:translateY(-2px)}.client-logo{width:80px;height:60px;object-fit:contain;margin:0 auto}.client-logo-placeholder{font-size:40px;margin-bottom:8px}.client-name{font-size:13px;font-weight:600;margin:10px 0 8px}.client-actions{display:flex;justify-content:center;gap:8px}`] })
export class ClientsComponent implements OnInit {
  clients:Client[]=[]; form!:FormGroup; modalOpen=false; editId:number|null=null; saving=false; page=0; totalPages=0;
  constructor(private fb:FormBuilder,private api:ApiService,private toast:ToastService){}
  ngOnInit(){this.initForm();this.load();}
  initForm(){this.form=this.fb.group({name:['',Validators.required],logoMediaId:[null],displayOrder:[0]});}
  load(){this.api.getClients(undefined,this.page).subscribe(r=>{this.clients=r.data?.content||[];this.totalPages=r.data?.totalPages||0;});}
  onPageChange(p:number){this.page=p;this.load();}
  openForm(){this.editId=null;this.initForm();this.modalOpen=true;}
  edit(c:Client){this.editId=c.id;this.form.patchValue(c);this.modalOpen=true;}
  closeForm(){this.modalOpen=false;}
  submit(){if(this.form.invalid){this.toast.warning('Name required');return;}this.saving=true;const obs=this.editId?this.api.updateClient(this.editId,this.form.value):this.api.createClient(this.form.value);obs.subscribe({next:()=>{this.toast.success('Saved!');this.closeForm();this.load();this.saving=false;},error:()=>{this.toast.error('Error');this.saving=false;}});}
  remove(id:number){if(!confirm('Delete?'))return;this.api.deleteClient(id).subscribe({next:()=>{this.toast.success('Deleted');this.load();},error:()=>this.toast.error('Error')});}
}
