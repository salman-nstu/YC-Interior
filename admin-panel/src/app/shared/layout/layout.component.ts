import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
  template: `
    <div class="admin-layout" [class.dark-mode]="themeService.darkMode()">
      <app-sidebar [collapsed]="sidebarCollapsed()" (toggleCollapse)="toggleSidebar()"></app-sidebar>
      <div class="main-content" [class.collapsed]="sidebarCollapsed()">
        <app-navbar
          [darkMode]="themeService.darkMode()"
          (toggleSidebar)="toggleSidebar()"
          (toggleDark)="themeService.toggleTheme()">
        </app-navbar>
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    .main-content {
      margin-left: var(--sidebar-w);
      transition: margin-left .3s ease;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .main-content.collapsed {
      margin-left: var(--sidebar-w-col);
    }
    
    .page-content {
      flex: 1;
      padding: 24px;
      background: var(--bg);
    }
    
    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
      }
      .main-content.collapsed {
        margin-left: 0;
      }
    }
  `]
})
export class LayoutComponent {
  themeService = inject(ThemeService);
  sidebarCollapsed = signal(false);

  toggleSidebar() { 
    this.sidebarCollapsed.update(v => !v); 
  }
}
