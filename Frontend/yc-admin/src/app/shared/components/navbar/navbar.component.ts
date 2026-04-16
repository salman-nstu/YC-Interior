import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  template: `
    <header class="navbar">
      <div class="navbar-left">
        <button class="btn-icon" (click)="toggleSidebar.emit()" title="Toggle sidebar">☰</button>
        <div class="breadcrumb" *ngIf="pageTitle">
          <span class="text-muted">Admin</span>
          <span class="breadcrumb-sep">/</span>
          <span class="font-semibold">{{pageTitle}}</span>
        </div>
      </div>
      <div class="navbar-right">
        <button class="btn-icon" (click)="toggleDarkMode()" [title]="isDark ? 'Light mode' : 'Dark mode'">
          {{isDark ? '☀️' : '🌙'}}
        </button>
        <div class="admin-menu" (click)="menuOpen = !menuOpen" (clickOutside)="menuOpen = false">
          <div class="admin-avatar">{{adminInitials}}</div>
          <div class="admin-info" *ngIf="true">
            <span class="admin-name">{{adminName}}</span>
            <span class="admin-role">Administrator</span>
          </div>
          <span>▾</span>
          <div class="dropdown-menu" *ngIf="menuOpen">
            <button class="dropdown-item danger" (click)="logout()">🚪 Logout</button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      position: fixed; top: 0; right: 0; left: var(--sidebar-width);
      height: var(--navbar-height);
      background: var(--bg-card);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 24px;
      z-index: 800;
      transition: left var(--transition);
      box-shadow: var(--shadow-sm);
    }
    .navbar-left, .navbar-right { display: flex; align-items: center; gap: 14px; }
    .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 14px; }
    .breadcrumb-sep { color: var(--text-muted); }
    .admin-menu {
      display: flex; align-items: center; gap: 10px;
      cursor: pointer; padding: 6px 10px;
      border-radius: 8px;
      border: 1px solid var(--border);
      position: relative;
      user-select: none;
      transition: background var(--transition);
    }
    .admin-menu:hover { background: var(--bg); }
    .admin-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: var(--primary); color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700;
    }
    .admin-info { display: flex; flex-direction: column; line-height: 1.2; }
    .admin-name { font-size: 13px; font-weight: 600; }
    .admin-role { font-size: 11px; color: var(--text-muted); }
    .dropdown-menu {
      position: absolute; top: calc(100% + 8px); right: 0;
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 10px; box-shadow: var(--shadow-md);
      min-width: 160px; overflow: hidden;
      animation: slideUp 0.15s ease;
    }
    .dropdown-item {
      display: flex; align-items: center; gap: 8px;
      width: 100%; padding: 10px 16px;
      background: none; border: none;
      font-size: 13px; font-weight: 500; cursor: pointer;
      transition: background var(--transition);
      font-family: inherit; color: var(--text-primary);
    }
    .dropdown-item:hover { background: var(--bg); }
    .dropdown-item.danger { color: var(--danger); }
    .dropdown-item.danger:hover { background: var(--danger-light); }
  `]
})
export class NavbarComponent implements OnInit {
  @Input() sidebarCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  menuOpen = false;
  isDark = false;
  adminName = 'Admin';
  adminInitials = 'A';
  pageTitle = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const admin = this.authService.getAdmin();
    if (admin) {
      this.adminName = admin.name;
      this.adminInitials = admin.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    this.isDark = document.body.classList.contains('dark-mode');
  }

  toggleDarkMode() {
    this.isDark = !this.isDark;
    document.body.classList.toggle('dark-mode', this.isDark);
    localStorage.setItem('darkMode', String(this.isDark));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
