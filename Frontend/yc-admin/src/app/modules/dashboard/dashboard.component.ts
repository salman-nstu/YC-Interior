import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { DashboardStats } from '../../core/models/models';
import { Router } from '@angular/router';

interface StatCard { label: string; value: number; icon: string; color: string; bg: string; route: string; }

@Component({
  selector: 'app-dashboard',
  template: `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Welcome back! Here's an overview of your platform.</p>
        </div>
        <div class="flex gap-8">
          <span class="badge badge-success">🟢 System Online</span>
        </div>
      </div>

      <div class="grid-4" style="margin-bottom:24px">
        <div *ngFor="let card of statCards" class="stat-card" (click)="router.navigate([card.route])" style="cursor:pointer">
          <div class="stat-icon" [style.background]="card.bg" [style.color]="card.color">{{card.icon}}</div>
          <div class="stat-info">
            <div class="stat-value" [style.color]="card.color">{{card.value}}</div>
            <div class="stat-label">{{card.label}}</div>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <!-- Projects Breakdown -->
        <div class="card">
          <div class="card-header">
            <h3 style="font-size:15px;font-weight:700">Projects Overview</h3>
            <button class="btn btn-ghost btn-sm" routerLink="/projects">View All →</button>
          </div>
          <div class="card-body" *ngIf="stats">
            <div class="breakdown-item">
              <span>📗 Published</span>
              <span class="badge badge-success">{{stats.publishedProjects}}</span>
            </div>
            <div class="breakdown-item">
              <span>📝 Draft</span>
              <span class="badge badge-warning">{{stats.draftProjects}}</span>
            </div>
            <div class="breakdown-item">
              <span>⭐ Featured</span>
              <span class="badge badge-primary">{{stats.featuredProjects}}</span>
            </div>
            <div class="breakdown-item">
              <span>🖼️ Gallery Featured</span>
              <span class="badge badge-info">{{stats.featuredGallery}}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <div class="card-header">
            <h3 style="font-size:15px;font-weight:700">Quick Actions</h3>
          </div>
          <div class="card-body">
            <div class="quick-actions">
              <button class="quick-action-btn" routerLink="/projects">➕ New Project</button>
              <button class="quick-action-btn" routerLink="/posts">📰 New Post</button>
              <button class="quick-action-btn" routerLink="/media">📤 Upload Media</button>
              <button class="quick-action-btn" routerLink="/services">🛠️ New Service</button>
              <button class="quick-action-btn" routerLink="/gallery">🎨 Add Gallery</button>
              <button class="quick-action-btn" routerLink="/contact">✉️ View Messages</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .breakdown-item { display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid var(--border); font-size:14px; }
    .breakdown-item:last-child { border-bottom:none; }
    .quick-actions { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    .quick-action-btn { padding:12px 16px; border-radius:10px; border:1.5px solid var(--border); background:var(--bg); color:var(--text-primary); cursor:pointer; font-size:13px; font-weight:500; transition:all 0.2s; font-family:inherit; text-align:left; }
    .quick-action-btn:hover { border-color:var(--primary); background:rgba(92,122,78,0.06); color:var(--primary); transform:translateY(-1px); }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  statCards: StatCard[] = [];

  constructor(private apiService: ApiService, public router: Router) {}

  ngOnInit() {
    this.apiService.getDashboardStats().subscribe(res => {
      if (res.success) {
        this.stats = res.data;
        this.buildCards();
      }
    });
  }

  buildCards() {
    if (!this.stats) return;
    this.statCards = [
      { label: 'Total Projects',  value: this.stats.totalProjects,   icon: '🏗️', color: '#5C7A4E', bg: 'rgba(92,122,78,0.12)',   route: '/projects' },
      { label: 'Total Services',  value: this.stats.totalServices,   icon: '🛠️', color: '#1A6AA0', bg: 'rgba(26,106,160,0.12)',  route: '/services' },
      { label: 'Gallery Items',   value: this.stats.totalGallery,    icon: '🎨', color: '#7B3FA0', bg: 'rgba(123,63,160,0.12)',  route: '/gallery' },
      { label: 'Total Clients',   value: this.stats.totalClients,    icon: '🤝', color: '#D4800A', bg: 'rgba(212,128,10,0.12)',  route: '/clients' },
      { label: 'Team Members',    value: this.stats.totalTeamMembers,icon: '👥', color: '#1E8449', bg: 'rgba(30,132,73,0.12)',   route: '/team' },
      { label: 'Total Posts',     value: this.stats.totalPosts,      icon: '📰', color: '#C0392B', bg: 'rgba(192,57,43,0.12)',   route: '/posts' },
      { label: 'Reviews',         value: this.stats.totalReviews,    icon: '⭐', color: '#F0A500', bg: 'rgba(240,165,0,0.12)',   route: '/reviews' },
      { label: 'Unread Messages', value: this.stats.unreadMessages,  icon: '✉️', color: '#2980B9', bg: 'rgba(41,128,185,0.12)', route: '/contact' },
    ];
  }
}
