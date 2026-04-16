import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Service } from '../../../core/models/models';

@Component({ selector: 'app-services-list', template: `
  <div>
    <div class="page-header">
      <div><h1 class="page-title">Services</h1><p class="page-subtitle">Manage interior design services</p></div>
      <button class="btn btn-primary" routerLink="/services/new" id="add-service-btn">➕ New Service</button>
    </div>
    <div class="card" style="margin-bottom:20px">
      <div class="card-body" style="display:flex;gap:12px;padding:16px 20px">
        <div class="search-bar" style="flex:1"><span class="search-icon">🔍</span><input class="form-control" [(ngModel)]="keyword" (input)="onSearch()" placeholder="Search services..." id="services-search" /></div>
        <select class="form-select" [(ngModel)]="statusFilter" (change)="load()" style="width:140px" id="service-status-filter"><option value="">All</option><option value="published">Published</option><option value="draft">Draft</option></select>
      </div>
    </div>
    <div class="card">
      <div class="table-container">
        <table class="table">
          <thead><tr><th>Cover</th><th>Title</th><th>Status</th><th>Order</th><th>Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let s of services">
              <td><img [src]="s.coverMedia?.url" class="thumb-sm" *ngIf="s.coverMedia" /></td>
              <td><p class="font-semibold" style="font-size:13px">{{s.title}}</p><p class="text-muted" style="font-size:11px;max-width:300px" class="truncate">{{s.description}}</p></td>
              <td><span class="badge" [class.badge-success]="s.status==='published'" [class.badge-warning]="s.status==='draft'">{{s.status}}</span></td>
              <td class="text-muted">{{s.displayOrder}}</td>
              <td><div class="flex gap-8"><button class="btn-icon" [routerLink]="['/services/edit', s.id]" [id]="'edit-service-'+s.id">✏️</button><button class="btn-icon danger" (click)="remove(s)" [id]="'delete-service-'+s.id">🗑️</button></div></td>
            </tr>
            <tr *ngIf="!services.length"><td colspan="5" class="empty-state" style="padding:40px"><div class="empty-icon">🛠️</div><p class="empty-title">No services yet</p></td></tr>
          </tbody>
        </table>
      </div>
      <app-pagination [totalPages]="totalPages" [currentPage]="page" (pageChange)="onPageChange($event)"></app-pagination>
    </div>
    <app-confirm-dialog [visible]="deleteVisible" title="Delete Service" message="Delete this service permanently?" (confirmed)="doDelete()" (cancelled)="deleteVisible=false"></app-confirm-dialog>
  </div>
` })
export class ServicesListComponent implements OnInit {
  services: Service[] = []; keyword = ''; statusFilter = ''; page = 0; totalPages = 0;
  deleteVisible = false; selected: Service | null = null; private t: any;
  constructor(private api: ApiService, private toast: ToastService, public router: Router) {}
  ngOnInit() { this.load(); }
  load() { this.api.getServices(this.keyword||undefined, this.statusFilter||undefined, this.page).subscribe(r => { this.services = r.data?.content||[]; this.totalPages = r.data?.totalPages||0; }); }
  onSearch() { clearTimeout(this.t); this.t = setTimeout(() => { this.page=0; this.load(); }, 400); }
  onPageChange(p: number) { this.page=p; this.load(); }
  remove(s: Service) { this.selected=s; this.deleteVisible=true; }
  doDelete() { if(!this.selected) return; this.api.deleteService(this.selected.id).subscribe({ next: ()=>{ this.toast.success('Deleted'); this.load(); }, error: ()=>this.toast.error('Error') }); }
}
