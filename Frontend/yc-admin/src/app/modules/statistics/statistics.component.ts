import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Statistic } from '../../core/models/models';

@Component({ selector: 'app-statistics', template: `
  <div>
    <div class="page-header"><div><h1 class="page-title">Statistics</h1><p class="page-subtitle">Manage site statistics & counters</p></div><button class="btn btn-primary" (click)="openForm()" id="add-stat-btn">➕ Add Statistic</button></div>
    <div class="grid-3" style="margin-bottom:24px">
      <div *ngFor="let s of stats" class="stat-card" style="cursor:default">
        <div class="stat-icon" style="background:rgba(92,122,78,0.12);color:var(--primary);font-size:28px">{{s.icon||'📊'}}</div>
        <div class="stat-info">
          <div class="stat-value">{{s.value}}</div>
          <div class="stat-label">{{s.label}}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-left:auto">
          <button class="btn-icon" (click)="edit(s)" [id]="'edit-stat-'+s.id">✏️</button>
          <button class="btn-icon danger" (click)="remove(s.id)" [id]="'delete-stat-'+s.id">🗑️</button>
        </div>
      </div>
      <div *ngIf="!stats.length" class="empty-state" style="grid-column:1/-1"><div class="empty-icon">📊</div><p class="empty-title">No statistics yet</p></div>
    </div>

    <div class="modal-backdrop" *ngIf="modalOpen" (click)="closeForm()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header"><h3 class="modal-title">{{editId?'Edit':'Add'}} Statistic</h3><button class="btn-icon" (click)="closeForm()">✕</button></div>
        <div class="modal-body">
          <form [formGroup]="form">
            <div class="form-group"><label class="form-label">Label <span class="required">*</span></label><input formControlName="label" class="form-control" placeholder="e.g. Projects Completed" id="stat-label" /></div>
            <div class="form-group"><label class="form-label">Value <span class="required">*</span></label><input type="number" formControlName="value" class="form-control" placeholder="250" id="stat-value" /></div>
            <div class="form-group"><label class="form-label">Icon (emoji)</label><input formControlName="icon" class="form-control" placeholder="🏗️" id="stat-icon" /></div>
            <div class="form-group"><label class="form-label">Display Order</label><input type="number" formControlName="displayOrder" class="form-control" /></div>
          </form>
        </div>
        <div class="modal-footer"><button class="btn btn-ghost" (click)="closeForm()">Cancel</button><button class="btn btn-primary" (click)="submit()" [disabled]="saving" id="save-stat-btn">{{saving?'Saving...':'Save'}}</button></div>
      </div>
    </div>
  </div>
` })
export class StatisticsComponent implements OnInit {
  stats: Statistic[]=[]; form!: FormGroup; modalOpen=false; editId:number|null=null; saving=false;
  constructor(private fb:FormBuilder, private api:ApiService, private toast:ToastService){}
  ngOnInit(){this.initForm();this.load();}
  initForm(){this.form=this.fb.group({label:['',Validators.required],value:[0,Validators.required],icon:[''],displayOrder:[0]});}
  load(){this.api.getStatistics().subscribe(r=>this.stats=r.data||[]);}
  openForm(){this.editId=null;this.initForm();this.modalOpen=true;}
  edit(s:Statistic){this.editId=s.id;this.form.patchValue(s);this.modalOpen=true;}
  closeForm(){this.modalOpen=false;}
  submit(){if(this.form.invalid)return;this.saving=true;const obs=this.editId?this.api.updateStatistic(this.editId,this.form.value):this.api.createStatistic(this.form.value);obs.subscribe({next:()=>{this.toast.success('Saved!');this.closeForm();this.load();this.saving=false;},error:()=>{this.toast.error('Error');this.saving=false;}});}
  remove(id:number){if(!confirm('Delete?'))return;this.api.deleteStatistic(id).subscribe({next:()=>{this.toast.success('Deleted');this.load();},error:()=>this.toast.error('Error')});}
}
