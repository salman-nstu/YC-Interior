import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, MatTooltipModule],
  template: `
    <header class="navbar">
      <div class="navbar-left">
        <button mat-icon-button (click)="toggleSidebar.emit()" matTooltip="Toggle sidebar">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="page-title">{{ title }}</span>
      </div>

      <div class="navbar-right">
        <button mat-icon-button (click)="toggleDark.emit()" [matTooltip]="darkMode ? 'Light mode' : 'Dark mode'">
          <mat-icon>{{ darkMode ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>

        <button mat-button [matMenuTriggerFor]="adminMenu" class="admin-btn">
          <mat-icon>account_circle</mat-icon>
          <span>{{ admin?.name || 'Admin' }}</span>
          <mat-icon>arrow_drop_down</mat-icon>
        </button>

        <mat-menu #adminMenu="matMenu">
          <div class="admin-info">
            <strong>{{ admin?.name }}</strong>
            <small>{{ admin?.email }}</small>
          </div>
          <button mat-menu-item (click)="auth.logout()">
            <mat-icon>logout</mat-icon> Logout
          </button>
        </mat-menu>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      height: var(--navbar-h);
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 16px;
      box-shadow: var(--shadow);
      position: sticky; top: 0; z-index: 50;
      transition: background-color .3s ease, border-color .3s ease;
    }
    
    .navbar-left { 
      display: flex; 
      align-items: center; 
      gap: 8px; 
    }
    
    .page-title { 
      font-size: 16px; 
      font-weight: 500; 
      color: var(--text); 
      transition: color .3s ease;
    }
    
    .navbar-right { 
      display: flex; 
      align-items: center; 
      gap: 4px; 
    }
    
    .admin-btn { 
      display: flex; 
      align-items: center; 
      gap: 4px; 
      color: var(--text);
      transition: color .3s ease;
      
      &:hover {
        background: var(--surface-alt);
      }
    }
    
    .admin-info {
      padding: 12px 16px;
      display: flex; flex-direction: column;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
      
      strong { 
        font-size: 14px; 
        color: var(--text);
      }
      small { 
        font-size: 12px; 
        color: var(--text-muted); 
      }
    }
    
    /* Dark mode button styling */
    button[mat-icon-button] {
      color: var(--text);
      transition: color .3s ease, background-color .3s ease;
      
      &:hover {
        background: var(--surface-alt);
      }
    }
    
    /* Mobile responsive */
    @media (max-width: 768px) {
      .navbar {
        padding: 0 12px;
        height: 56px;
      }
      
      .page-title {
        font-size: 14px;
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .admin-btn {
        min-width: unset;
        padding: 0 8px;
        
        span {
          display: none;
        }
        
        mat-icon:last-child {
          display: none;
        }
      }
      
      button[mat-icon-button] {
        width: 40px;
        height: 40px;
      }
    }
  `]
})
export class NavbarComponent {
  @Input() title = 'Admin Panel';
  @Input() darkMode = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() toggleDark = new EventEmitter<void>();

  auth = inject(AuthService);
  get admin() { return this.auth.currentAdmin(); }
}
