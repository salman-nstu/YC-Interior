import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-logo">
        <div class="logo-icon">🌿</div>
        <span class="logo-text" *ngIf="!collapsed">YC Interior</span>
      </div>
      <div class="sidebar-divider"></div>
      <nav class="sidebar-nav">
        <a *ngFor="let item of navItems"
           [routerLink]="item.route"
           routerLinkActive="active"
           class="nav-item"
           [title]="collapsed ? item.label : ''">
          <span class="nav-icon">{{item.icon}}</span>
          <span class="nav-label" *ngIf="!collapsed">{{item.label}}</span>
          <span class="nav-badge" *ngIf="item.badge && !collapsed">{{item.badge}}</span>
        </a>
      </nav>
      <div class="sidebar-footer">
        <button class="collapse-btn" (click)="toggleCollapse.emit()">
          <span>{{collapsed ? '→' : '←'}}</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed; top: 0; left: 0; bottom: 0;
      width: var(--sidebar-width);
      background: var(--bg-sidebar);
      display: flex; flex-direction: column;
      z-index: 900;
      transition: width var(--transition);
      overflow: hidden;
    }
    .sidebar.collapsed { width: var(--sidebar-collapsed); }
    .sidebar-logo {
      display: flex; align-items: center; gap: 12px;
      padding: 20px 18px;
      font-size: 16px; font-weight: 700;
      color: white;
      min-height: var(--navbar-height);
      white-space: nowrap;
    }
    .logo-icon { font-size: 24px; flex-shrink: 0; }
    .logo-text { color: var(--accent-light); letter-spacing: 0.02em; }
    .sidebar-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 0 16px; }
    .sidebar-nav { flex: 1; padding: 12px 10px; overflow-y: auto; overflow-x: hidden; }
    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      color: var(--text-sidebar);
      text-decoration: none;
      font-size: 13px; font-weight: 500;
      transition: all var(--transition);
      white-space: nowrap;
      cursor: pointer;
      margin-bottom: 2px;
    }
    .nav-item:hover { background: var(--bg-sidebar-hover); color: white; }
    .nav-item.active { background: var(--primary); color: white; }
    .nav-icon { font-size: 18px; flex-shrink: 0; width: 22px; text-align: center; }
    .nav-badge {
      margin-left: auto; background: var(--danger);
      color: white; font-size: 11px; font-weight: 700;
      padding: 2px 7px; border-radius: 99px;
    }
    .sidebar-footer { padding: 12px 10px; border-top: 1px solid rgba(255,255,255,0.08); }
    .collapse-btn {
      width: 100%; padding: 10px; border-radius: 8px;
      background: rgba(255,255,255,0.07); border: none;
      color: var(--text-sidebar); cursor: pointer;
      font-size: 16px; transition: background var(--transition);
    }
    .collapse-btn:hover { background: rgba(255,255,255,0.14); }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Dashboard',     icon: '📊', route: '/dashboard' },
    { label: 'Media Library', icon: '🖼️', route: '/media' },
    { label: 'Projects',      icon: '🏗️', route: '/projects' },
    { label: 'Services',      icon: '🛠️', route: '/services' },
    { label: 'Gallery',       icon: '🎨', route: '/gallery' },
    { label: 'About',         icon: '📋', route: '/about' },
    { label: 'Statistics',    icon: '📈', route: '/statistics' },
    { label: 'Posts',         icon: '📰', route: '/posts' },
    { label: 'Team',          icon: '👥', route: '/team' },
    { label: 'Clients',       icon: '🤝', route: '/clients' },
    { label: 'Reviews',       icon: '⭐', route: '/reviews' },
    { label: 'FAQs',          icon: '❓', route: '/faqs' },
    { label: 'Contact',       icon: '✉️', route: '/contact' },
    { label: 'Settings',      icon: '⚙️', route: '/settings' }
  ];
}
