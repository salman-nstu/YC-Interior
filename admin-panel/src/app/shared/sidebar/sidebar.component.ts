import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    <aside class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <div class="logo">
          <mat-icon>architecture</mat-icon>
          <span *ngIf="!collapsed" class="logo-text">YC Interior</span>
        </div>
        <button class="toggle-btn" (click)="toggleCollapse.emit()">
          <mat-icon>{{ collapsed ? 'chevron_right' : 'chevron_left' }}</mat-icon>
        </button>
      </div>

      <nav class="sidebar-nav">
        <a *ngFor="let item of navItems"
           [routerLink]="item.route"
           routerLinkActive="active"
           class="nav-item"
           [matTooltip]="collapsed ? item.label : ''"
           matTooltipPosition="right">
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
      transition: width .3s ease, background-color .3s ease;
      z-index: 100;
      overflow: hidden;
      box-shadow: var(--shadow);
    }
    .sidebar.collapsed { width: var(--sidebar-w-col); }

    .sidebar-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 12px;
      border-bottom: 1px solid var(--border);
      min-height: var(--navbar-h);
    }
    .logo {
      display: flex; align-items: center; gap: 10px;
      mat-icon { 
        color: var(--matcha-light); 
        font-size: 28px; 
        width: 28px; 
        height: 28px; 
      }
    }
    .logo-text { 
      font-size: 16px; 
      font-weight: 700; 
      white-space: nowrap; 
      color: var(--sidebar-text);
    }
    .toggle-btn {
      background: none; 
      border: none; 
      cursor: pointer;
      color: var(--text-muted); 
      padding: 4px;
      border-radius: 4px; 
      display: flex;
      transition: background-color .2s ease, color .2s ease;
      &:hover { 
        background: var(--sidebar-hover); 
        color: var(--sidebar-text); 
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
      color: var(--text-muted);
      cursor: pointer; 
      white-space: nowrap;
      transition: background-color .2s ease, color .2s ease;
      border-left: 3px solid transparent;
      text-decoration: none;
      
      mat-icon { 
        flex-shrink: 0; 
        font-size: 20px; 
        width: 20px; 
        height: 20px; 
      }
      span { 
        font-size: 14px; 
      }
      
      &:hover { 
        background: var(--sidebar-hover); 
        color: var(--sidebar-text); 
      }
      
      &.active {
        background: var(--sidebar-active);
        color: var(--sidebar-text);
        border-left-color: var(--matcha-light);
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
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Dashboard',        icon: 'dashboard',       route: '/dashboard' },
    { label: 'Projects',         icon: 'business',        route: '/projects' },
    { label: 'Services',         icon: 'design_services', route: '/services' },
    { label: 'Gallery',          icon: 'photo_library',   route: '/gallery' },
    { label: 'Media',            icon: 'perm_media',      route: '/media' },
    { label: 'Posts',            icon: 'article',         route: '/posts' },
    { label: 'Team',             icon: 'group',           route: '/team' },
    { label: 'Clients',          icon: 'handshake',       route: '/clients' },
    { label: 'Reviews',          icon: 'star',            route: '/reviews' },
    { label: 'FAQs',             icon: 'help',            route: '/faqs' },
    { label: 'About',            icon: 'info',            route: '/about' },
    { label: 'Statistics',       icon: 'bar_chart',       route: '/statistics' },
    { label: 'Messages',         icon: 'mail',            route: '/messages' },
    { label: 'Settings',         icon: 'settings',        route: '/settings' },
  ];
}
