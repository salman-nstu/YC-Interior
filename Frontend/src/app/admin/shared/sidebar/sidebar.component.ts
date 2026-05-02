import { Component, Input, Output, EventEmitter, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MiscService } from '../../../core/services/misc.service';
import { SettingsResponse } from '../../../core/models/misc.model';
import { SettingsStateService } from '../../../core/services/settings-state.service';
import { Subscription } from 'rxjs';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive, MatIconModule, MatTooltipModule],
  template: `
    <!-- Mobile overlay -->
    <div class="sidebar-overlay" [class.show]="!collapsed" (click)="toggleCollapse.emit()"></div>
    
    <aside class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <a [routerLink]="'/admin/dashboard'" class="logo" (click)="onLogoClick()">
          <img *ngIf="settings?.logoMedia?.url && !collapsed" [src]="settings?.logoMedia?.url || ''" [alt]="settings?.siteName || 'Logo'" class="logo-img">
          <mat-icon *ngIf="!settings?.logoMedia?.url || collapsed">architecture</mat-icon>
          <span *ngIf="!collapsed" class="logo-text">{{ settings?.siteName || 'YC Interior' }}</span>
        </a>
        <button class="toggle-btn" (click)="toggleCollapse.emit()" [matTooltip]="collapsed ? 'Expand sidebar' : 'Collapse sidebar'" matTooltipPosition="right">
          <mat-icon>{{ collapsed ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left' }}</mat-icon>
        </button>
      </div>

      <nav class="sidebar-nav">
        <a *ngFor="let item of navItems"
           [routerLink]="item.route"
           routerLinkActive="active"
           class="nav-item"
           [matTooltip]="collapsed ? item.label : ''"
           matTooltipPosition="right"
           (click)="onNavClick()">
          <mat-icon>{{ item.icon }}</mat-icon>
          <span *ngIf="!collapsed">{{ item.label }}</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed; left: 0; top: 0; bottom: 0;
      width: var(--sidebar-w);
      background: var(--sidebar-bg);
      color: var(--sidebar-text);
      display: flex; flex-direction: column;
      transition: width .3s ease, background-color .3s ease, transform .3s ease;
      z-index: 100;
      overflow: hidden;
      box-shadow: var(--shadow);
    }
    .sidebar.collapsed { 
      width: var(--sidebar-w-col); 
      
      .sidebar-header {
        justify-content: center;
        padding: 16px 8px;
      }
      
      .toggle-btn {
        margin: 0;
      }
    }

    .sidebar-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 12px;
      border-bottom: 1px solid rgba(255,255,255,.1);
      min-height: var(--navbar-h);
      gap: 8px;
    }
    .logo {
      display: flex; align-items: center; gap: 10px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: background-color .2s ease;
      text-decoration: none;
      
      &:hover {
        background: var(--sidebar-hover);
      }
      
      mat-icon { 
        color: var(--matcha-light); 
        font-size: 28px; 
        width: 28px; 
        height: 28px; 
      }
    }
    .logo-img {
      width: 40px;
      height: 40px;
      object-fit: contain;
      border-radius: 4px;
    }
    .logo-text { 
      font-size: 16px; 
      font-weight: 700; 
      white-space: nowrap; 
      color: var(--sidebar-text);
    }
    .toggle-btn {
      background: var(--sidebar-hover); 
      border: 1px solid rgba(255,255,255,.1);
      cursor: pointer;
      color: var(--sidebar-text); 
      padding: 6px;
      border-radius: 6px; 
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all .2s ease;
      width: 32px;
      height: 32px;
      
      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
      
      &:hover { 
        background: rgba(255,255,255,.2);
        border-color: rgba(255,255,255,.2);
        transform: scale(1.05);
      }
      
      &:active {
        transform: scale(0.95);
      }
    }

    .sidebar-nav {
      flex: 1; 
      overflow-y: auto; 
      overflow-x: hidden;
      padding: 8px 0;
    }
    .nav-item {
      display: flex; 
      align-items: center; 
      gap: 12px;
      padding: 12px 16px;
      color: var(--sidebar-text);
      cursor: pointer; 
      white-space: nowrap;
      transition: background-color .2s ease, color .2s ease;
      border-left: 3px solid transparent;
      text-decoration: none;
      opacity: 0.8;
      
      mat-icon { 
        flex-shrink: 0; 
        font-size: 20px; 
        width: 20px; 
        height: 20px; 
      }
      span { 
        font-size: 14px;
        overflow: visible;
        text-overflow: clip;
      }
      
      &:hover { 
        background: var(--sidebar-hover); 
        color: var(--sidebar-text);
        opacity: 1;
      }
      
      &.active {
        background: var(--sidebar-active);
        color: var(--sidebar-text);
        border-left-color: var(--matcha-light);
        opacity: 1;
      }
    }
    
    .sidebar.collapsed .nav-item { 
      justify-content: center; 
      padding: 14px; 
    }
    
    /* Custom scrollbar for sidebar */
    .sidebar-nav::-webkit-scrollbar {
      width: 4px;
    }
    
    .sidebar-nav::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .sidebar-nav::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 2px;
    }
    
    .sidebar-nav::-webkit-scrollbar-thumb:hover {
      background: var(--text-muted);
    }
    
    /* Mobile overlay */
    .sidebar-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 99;
      opacity: 0;
      transition: opacity .3s ease;
      pointer-events: none;
    }
    
    /* Mobile responsive */
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        z-index: 101;
        width: var(--sidebar-w);
      }
      
      .sidebar:not(.collapsed) {
        transform: translateX(0);
      }
      
      .sidebar-overlay {
        display: block;
      }
      
      .sidebar-overlay.show {
        opacity: 1;
        pointer-events: auto;
      }
      
      .toggle-btn {
        display: flex;
      }
    }
  `]
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();
  
  private miscService = inject(MiscService);
  private settingsState = inject(SettingsStateService);
  private subscription?: Subscription;
  
  settings: SettingsResponse | null = null;

  navItems: NavItem[] = [
    { label: 'Dashboard',        icon: 'dashboard',       route: '/admin/dashboard' },
    { label: 'Projects',         icon: 'business',        route: '/admin/projects' },
    { label: 'Services',         icon: 'design_services', route: '/admin/services' },
    { label: 'Gallery',          icon: 'photo_library',   route: '/admin/gallery' },
    { label: 'Posts',            icon: 'article',         route: '/admin/posts' },
    { label: 'Team',             icon: 'group',           route: '/admin/team' },
    { label: 'Clients',          icon: 'handshake',       route: '/admin/clients' },
    { label: 'Reviews',          icon: 'star',            route: '/admin/reviews' },
    { label: 'FAQs',             icon: 'help',            route: '/admin/faqs' },
    { label: 'About',            icon: 'info',            route: '/admin/about' },
    { label: 'Statistics',       icon: 'bar_chart',       route: '/admin/statistics' },
    { label: 'Messages',         icon: 'mail',            route: '/admin/messages' },
    { label: 'Settings',         icon: 'settings',        route: '/admin/settings' },
  ];
  
  ngOnInit() {
    // Subscribe to settings changes
    this.subscription = this.settingsState.settings$.subscribe(settings => {
      console.log('Sidebar received settings update:', settings);
      this.settings = settings;
    });
    
    // Load settings if not already loaded
    if (!this.settingsState.getSettings()) {
      this.loadSettings();
    } else {
      console.log('Using cached settings:', this.settingsState.getSettings());
    }
  }
  
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  
  loadSettings() {
    this.miscService.getSettings().subscribe({
      next: (response) => {
        this.settingsState.updateSettings(response.data);
      },
      error: (err) => {
        console.error('Failed to load settings:', err);
      }
    });
  }
  
  // Close sidebar on mobile when logo is clicked
  onLogoClick() {
    if (window.innerWidth <= 768) {
      this.toggleCollapse.emit();
    }
  }
  
  // Close sidebar on mobile when nav item is clicked
  onNavClick() {
    if (window.innerWidth <= 768) {
      this.toggleCollapse.emit();
    }
  }
}
