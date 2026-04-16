import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Faq } from '../../core/models/models';

@Component({ selector: 'app-faqs', template: `
  <div>
    <div class="page-header"><div><h1 class="page-title">FAQs</h1><p class="page-subtitle">Frequently asked questions</p></div><button class="btn btn-primary" (click)="openForm()" id="add-faq-btn">➕ Add FAQ</button></div>
    <div class="card" style="margin-bottom:20px"><div class="card-body" style="padding:14px 20px"><div class="search-bar"><span class="search-icon">🔍</span><input class="form-control" [(ngModel)]="keyword" (input)="onSearch()" placeholder="Search FAQs..." id="faqs-search" /></div></div></div>
    <div class="card">
      <div class="table-container">
        <table class="table">
          <thead><tr><th>#</th><th>Question</th><th>Order</th><th>Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let f of faqs; let i=index">
              <td class="text-muted" style="font-size:12px">{{i+1}}</td>
              <td><p class="font-semibold" style="font-size:13px">{{f.question}}</p><p class="text-muted" style="font-size:12px;max-width:400px">{{f.answer | slice:0:80}}...</p></td>
              <td>{{f.displayOrder}}</td>
              <td><div class="flex gap-8"><button class="btn-icon" (click)="edit(f)" [id]="'edit-faq-'+f.id">✏️</button><button class="btn-icon danger" (click)="remove(f.id)" [id]="'delete-faq-'+f.id">🗑️</button></div></td>
            </tr>
            <tr *ngIf="!faqs.length"><td colspan="4" class="empty-state" style="padding:40px"><div class="empty-icon">❓</div><p class="empty-title">No FAQs yet</p></td></tr>
          </tbody>
        </table>
      </div>
      <app-pagination [totalPages]="totalPages" [currentPage]="page" (pageChange)="onPageChange($event)"></app-pagination>
    </div>
    <div class="modal-backdrop" *ngIf="modalOpen" (click)="closeForm()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header"><h3 class="modal-title">{{editId?'Edit':'Add'}} FAQ</h3><button class="btn-icon" (click)="closeForm()">✕</button></div>
        <div class="modal-body"><form [formGroup]="form">
          <div class="form-group"><label class="form-label">Question <span class="required">*</span></label><input formControlName="question" class="form-control" id="faq-question" /></div>
          <div class="form-group"><label class="form-label">Answer <span class="required">*</span></label><textarea formControlName="answer" class="form-control" rows="5" id="faq-answer"></textarea></div>
          <div class="form-group"><label class="form-label">Display Order</label><input type="number" formControlName="displayOrder" class="form-control" /></div>
        </form></div>
        <div class="modal-footer"><button class="btn btn-ghost" (click)="closeForm()">Cancel</button><button class="btn btn-primary" (click)="submit()" [disabled]="saving" id="save-faq-btn">{{saving?'Saving...':'Save'}}</button></div>
      </div>
    </div>
  </div>
` })
export class FaqsComponent implements OnInit {
  faqs:Faq[]=[]; form!:FormGroup; modalOpen=false; editId:number|null=null; saving=false;
  keyword=''; page=0; totalPages=0; private t:any;
  constructor(private fb:FormBuilder,private api:ApiService,private toast:ToastService){}
  ngOnInit(){this.initForm();this.load();}
  initForm(){this.form=this.fb.group({question:['',Validators.required],answer:['',Validators.required],displayOrder:[0]});}
  load(){this.api.getFaqs(this.keyword||undefined,this.page).subscribe(r=>{this.faqs=r.data?.content||[];this.totalPages=r.data?.totalPages||0;});}
  onSearch(){clearTimeout(this.t);this.t=setTimeout(()=>{this.page=0;this.load();},400);}
  onPageChange(p:number){this.page=p;this.load();}
  openForm(){this.editId=null;this.initForm();this.modalOpen=true;}
  edit(f:Faq){this.editId=f.id;this.form.patchValue(f);this.modalOpen=true;}
  closeForm(){this.modalOpen=false;}
  submit(){if(this.form.invalid){this.toast.warning('Fill all required fields');return;}this.saving=true;const obs=this.editId?this.api.updateFaq(this.editId,this.form.value):this.api.createFaq(this.form.value);obs.subscribe({next:()=>{this.toast.success('Saved!');this.closeForm();this.load();this.saving=false;},error:()=>{this.toast.error('Error');this.saving=false;}});}
  remove(id:number){if(!confirm('Delete?'))return;this.api.deleteFaq(id).subscribe({next:()=>{this.toast.success('Deleted');this.load();},error:()=>this.toast.error('Error')});}
}
