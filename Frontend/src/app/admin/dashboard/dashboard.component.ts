import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStats } from '../../core/models/dashboard.model';

interface StatCard {
  label: string;
  value: keyof DashboardStats;
  icon: string;
  color: string;
  route?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="page-header">
      <h1>Dashboard</h1>
    </div>

    <div *ngIf="loading" style="display:flex;justify-content:center;padding:40px">
      <mat-spinner diameter="40"></mat-spinner>
    </div>

    <div *ngIf="!loading && stats" class="stats-grid">
      <div class="stat-card" *ngFor="let card of statCards">
        <div class="stat-icon" [ngClass]="card.color">
          <mat-icon>{{ card.icon }}</mat-icon>
        </div>
        <div class="stat-info">
          <h3>{{ stats[card.value] }}</h3>
          <p>{{ card.label }}</p>
        </div>
      </div>
    </div>

    <div *ngIf="!loading && stats" class="summary-row mt-24">
      <div class="card">
        <h3 class="card-title">Projects Overview</h3>
        <div class="mini-stats">
          <div class="mini-stat">
            <span class="badge published">Published</span>
            <strong>{{ stats.publishedProjects }}</strong>
          </div>
          <div class="mini-stat">
            <span class="badge draft">Draft</span>
            <strong>{{ stats.draftProjects }}</strong>
          </div>
          <div class="mini-stat">
            <span class="badge featured">Featured</span>
            <strong>{{ stats.featuredProjects }}</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3 class="card-title">Gallery Overview</h3>
        <div class="mini-stats">
          <div class="mini-stat">
            <span class="badge active">Total</span>
            <strong>{{ stats.totalGallery }}</strong>
          </div>
          <div class="mini-stat">
            <span class="badge featured">Featured</span>
            <strong>{{ stats.featuredGallery }}</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3 class="card-title">Inbox</h3>
        <div class="mini-stats">
          <div class="mini-stat">
            <span class="badge unread">Unread</span>
            <strong>{{ stats.unreadMessages }}</strong>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="!loading && !stats" style="text-align:center;padding:60px;color:#9e9e9e">
      <p>Failed to load dashboard stats</p>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
    }
    .summary-row {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    .card-title { font-size: 15px; font-weight: 600; margin-bottom: 16px; color: var(--text); }
    .mini-stats { display: flex; gap: 16px; flex-wrap: wrap; }
    .mini-stat { display: flex; align-items: center; gap: 8px; }
    .mini-stat strong { font-size: 20px; font-weight: 700; }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 12px;
      }
      
      .summary-row {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      
      .card-title {
        font-size: 14px;
        margin-bottom: 12px;
      }
      
      .mini-stats {
        gap: 12px;
      }
      
      .mini-stat strong {
        font-size: 18px;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }
      
      .mini-stats {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private svc = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  
  stats: DashboardStats | null = null;
  loading = false;

  statCards: StatCard[] = [
    { label: 'Total Projects',  value: 'totalProjects',   icon: 'business',        color: 'green' },
    { label: 'Total Services',  value: 'totalServices',   icon: 'design_services', color: 'blue' },
    { label: 'Gallery Items',   value: 'totalGallery',    icon: 'photo_library',   color: 'orange' },
    { label: 'Clients',         value: 'totalClients',    icon: 'handshake',       color: 'purple' },
    { label: 'Reviews',         value: 'totalReviews',    icon: 'star',            color: 'orange' },
    { label: 'Team Members',    value: 'totalTeamMembers',icon: 'group',           color: 'teal' },
    { label: 'Posts',           value: 'totalPosts',      icon: 'article',         color: 'blue' },
    { label: 'Unread Messages', value: 'unreadMessages',  icon: 'mail',            color: 'red' },
  ];

  ngOnInit() {
    this.zone.run(() => {
      this.loading = true;
      this.cdr.markForCheck();
    });
    
    console.log('📊 Loading dashboard stats...');
    this.svc.getStats().subscribe({
      next: res => { 
        console.log('✅ Dashboard stats loaded', res);
        this.zone.run(() => {
          this.stats = res.data; 
          this.loading = false; 
          this.cdr.markForCheck();
          console.log('🎯 Loading state:', this.loading);
        });
      },
      error: err => { 
        console.error('❌ Dashboard stats error', err);
        this.zone.run(() => {
          this.loading = false; 
          this.cdr.markForCheck();
        });
      }
    });
  }
}
