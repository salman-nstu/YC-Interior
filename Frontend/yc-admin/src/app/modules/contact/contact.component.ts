import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ContactMessage } from '../../core/models/models';

@Component({ selector: 'app-contact', template: `
  <div>
    <div class="page-header"><div><h1 class="page-title">Contact Messages</h1><p class="page-subtitle">Incoming messages from the contact form</p></div>
      <div class="flex gap-8">
        <span class="badge badge-danger" *ngIf="unread > 0">{{unread}} Unread</span>
        <button class="btn btn-outline btn-sm" (click)="showRead=!showRead" id="toggle-read-filter">{{showRead?'Show Unread Only':'Show All'}}</button>
      </div>
    </div>
    <div class="card" style="margin-bottom:20px"><div class="card-body" style="padding:14px 20px"><div class="search-bar"><span class="search-icon">🔍</span><input class="form-control" [(ngModel)]="keyword" (input)="onSearch()" placeholder="Search messages..." id="contact-search" /></div></div></div>

    <div class="messages-list">
      <div *ngFor="let m of messages" class="message-card" [class.unread]="!m.isRead" (click)="openMessage(m)" [id]="'message-'+m.id">
        <div class="message-avatar">{{m.name[0]}}</div>
        <div class="message-body">
          <div class="message-header"><span class="message-name">{{m.name}}</span><span class="message-time text-muted">{{m.createdAt|date:'short'}}</span></div>
          <p class="message-email text-muted" style="font-size:12px">{{m.email}} {{m.phone?'· '+m.phone:''}}</p>
          <p class="message-subject font-medium" style="font-size:13px">{{m.subject}}</p>
          <p class="message-preview text-muted" style="font-size:12px">{{m.message|slice:0:100}}...</p>
        </div>
        <div class="message-meta"><span class="badge" [class.badge-danger]="!m.isRead" [class.badge-muted]="m.isRead">{{m.isRead?'Read':'Unread'}}</span></div>
      </div>
      <div *ngIf="!messages.length" class="empty-state"><div class="empty-icon">✉️</div><p class="empty-title">No messages found</p></div>
    </div>
    <app-pagination [totalPages]="totalPages" [currentPage]="page" (pageChange)="onPageChange($event)"></app-pagination>

    <!-- Detail Modal -->
    <div class="modal-backdrop" *ngIf="selected" (click)="selected=null">
      <div class="modal modal-lg" (click)="$event.stopPropagation()">
        <div class="modal-header"><h3 class="modal-title">{{selected.subject}}</h3><button class="btn-icon" (click)="selected=null">✕</button></div>
        <div class="modal-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;padding:16px;background:var(--bg);border-radius:10px">
            <div><p class="text-muted" style="font-size:11px">FROM</p><p class="font-semibold">{{selected.name}}</p></div>
            <div><p class="text-muted" style="font-size:11px">EMAIL</p><p>{{selected.email}}</p></div>
            <div><p class="text-muted" style="font-size:11px">PHONE</p><p>{{selected.phone||'—'}}</p></div>
            <div><p class="text-muted" style="font-size:11px">DATE</p><p>{{selected.createdAt|date:'medium'}}</p></div>
          </div>
          <p style="font-size:14px;line-height:1.8;color:var(--text-secondary);white-space:pre-wrap">{{selected.message}}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-danger btn-sm" (click)="remove(selected.id)" id="delete-message-btn">🗑️ Delete</button>
          <button class="btn btn-ghost" (click)="selected=null">Close</button>
        </div>
      </div>
    </div>
  </div>
`, styles:[`.messages-list{display:flex;flex-direction:column;gap:8px;margin-bottom:20px}.message-card{background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:18px 20px;display:flex;align-items:flex-start;gap:16px;cursor:pointer;transition:all 0.2s}.message-card:hover{box-shadow:var(--shadow-md);transform:translateY(-1px)}.message-card.unread{border-left:3px solid var(--primary)}.message-avatar{width:44px;height:44px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;flex-shrink:0}.message-body{flex:1}.message-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}.message-name{font-weight:700;font-size:14px}.message-meta{flex-shrink:0}`] })
export class ContactComponent implements OnInit {
  messages:ContactMessage[]=[]; selected:ContactMessage|null=null; keyword=''; showRead=true; page=0; totalPages=0; unread=0; private t:any;
  constructor(private api:ApiService,private toast:ToastService){}
  ngOnInit(){this.load();}
  load(){const isRead=this.showRead?undefined:false;this.api.getContactMessages(this.keyword||undefined,isRead,this.page).subscribe(r=>{this.messages=r.data?.content||[];this.totalPages=r.data?.totalPages||0;this.unread=this.messages.filter(m=>!m.isRead).length;});}
  onSearch(){clearTimeout(this.t);this.t=setTimeout(()=>{this.page=0;this.load();},400);}
  onPageChange(p:number){this.page=p;this.load();}
  openMessage(m:ContactMessage){this.selected=m;if(!m.isRead)this.api.markMessageRead(m.id).subscribe(()=>{m.isRead=true;this.unread=Math.max(0,this.unread-1);});}
  remove(id:number){this.api.deleteContactMessage(id).subscribe({next:()=>{this.toast.success('Deleted');this.selected=null;this.load();},error:()=>this.toast.error('Error')});}
}
