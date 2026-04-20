import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
  template: `
    <div class="admin-layout" [class.dark-mode]="darkMode()">
      <app-sidebar [collapsed]="sidebarCollapsed()" (toggleCollapse)="toggleSidebar()"></app-sidebar>
      <div class="main-content" [class.collapsed]="sidebarCollapsed()">
        <app-navbar
          [darkMode]="darkMode()"
          (toggleSidebar)="toggleSidebar()"
          (toggleDark)="toggleDark()">
        </app-navbar>
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class LayoutComponent {
  sidebarCollapsed = signal(false);
  darkMode = signal(false);

  toggleSidebar() { this.sidebarCollapsed.update(v => !v); }
  toggleDark() {
    this.darkMode.update(v => !v);
    document.body.classList.toggle('dark-mode', this.darkMode());
  }
}
