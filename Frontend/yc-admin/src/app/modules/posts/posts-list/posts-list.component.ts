import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Post } from '../../../core/models/models';

@Component({ selector: 'app-posts-list', template: `
  <div>
    <div class="page-header"><div><h1 class="page-title">Posts</h1><p class="page-subtitle">News & Events management</p></div>
      <div class="flex gap-8"><button class="btn btn-outline btn-sm" routerLink="/posts/categories">📁 Categories</button><button class="btn btn-primary" routerLink="/posts/new" id="add-post-btn">➕ New Post</button></div>
    </div>
    <div class="card" style="margin-bottom:20px"><div class="card-body" style="display:flex;gap:12px;padding:14px 20px">
      <div class="search-bar" style="flex:1"><span class="search-icon">🔍</span><input class="form-control" [(ngModel)]="keyword" (input)="onSearch()" placeholder="Search posts..." id="posts-search" /></div>
      <select class="form-select" [(ngModel)]="statusFilter" (change)="load()" style="width:140px" id="posts-status-filter"><option value="">All Status</option><option value="published">Published</option><option value="draft">Draft</option></select>
      <select class="form-select" [(ngModel)]="catFilter" (change)="load()" style="width:160px" id="posts-category-filter"><option value="">All Categories</option><option *ngFor="let c of categories" [value]="c.id">{{c.name}}</option></select>
    </div></div>
    <div class="card">
      <div class="table-container">
        <table class="table">
          <thead><tr><th>Cover</th><th>Title</th><th>Category</th><th>Status</th><th>Published</th><th>Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let p of posts">
              <td><img [src]="p.coverMedia?.url" class="thumb-sm" *ngIf="p.coverMedia" /></td>
              <td><p class="font-semibold" style="font-size:13px">{{p.title}}</p><p class="text-muted" style="font-size:11px">/{{p.slug}}</p></td>
              <td><span class="badge badge-muted">{{p.category?.name||'—'}}</span></td>
              <td><span class="badge" [class.badge-success]="p.status==='published'" [class.badge-warning]="p.status==='draft'">{{p.status}}</span></td>
              <td class="text-muted" style="font-size:12px">{{p.publishedAt|date:'mediumDate'}}</td>
              <td><div class="flex gap-8"><button class="btn-icon" [routerLink]="['/posts/edit',p.id]" [id]="'edit-post-'+p.id">✏️</button><button class="btn-icon danger" (click)="remove(p)" [id]="'delete-post-'+p.id">🗑️</button></div></td>
            </tr>
            <tr *ngIf="!posts.length"><td colspan="6" class="empty-state" style="padding:40px"><div class="empty-icon">📰</div><p class="empty-title">No posts yet</p></td></tr>
          </tbody>
        </table>
      </div>
      <app-pagination [totalPages]="totalPages" [currentPage]="page" (pageChange)="onPageChange($event)"></app-pagination>
    </div>
    <app-confirm-dialog [visible]="deleteVisible" title="Delete Post" message="Delete this post permanently?" (confirmed)="doDelete()" (cancelled)="deleteVisible=false"></app-confirm-dialog>
  </div>
` })
export class PostsListComponent implements OnInit {
  posts:Post[]=[]; categories:any[]=[]; keyword=''; statusFilter=''; catFilter=''; page=0; totalPages=0;
  deleteVisible=false; selected:Post|null=null; private t:any;
  constructor(private api:ApiService, private toast:ToastService, public router:Router){}
  ngOnInit(){this.api.getPostCategoriesList().subscribe(r=>this.categories=r.data||[]);this.load();}
  load(){const catId=this.catFilter?+this.catFilter:undefined;this.api.getPosts(this.keyword||undefined,this.statusFilter||undefined,catId,this.page).subscribe(r=>{this.posts=r.data?.content||[];this.totalPages=r.data?.totalPages||0;});}
  onSearch(){clearTimeout(this.t);this.t=setTimeout(()=>{this.page=0;this.load();},400);}
  onPageChange(p:number){this.page=p;this.load();}
  remove(p:Post){this.selected=p;this.deleteVisible=true;}
  doDelete(){if(!this.selected)return;this.api.deletePost(this.selected.id).subscribe({next:()=>{this.toast.success('Deleted');this.load();},error:()=>this.toast.error('Error')});}
}
