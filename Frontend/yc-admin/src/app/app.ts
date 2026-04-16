import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoadingService } from './core/services/loading.service';
import { AuthService } from './core/services/auth.service';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    NavbarComponent,
    ToastContainerComponent,
    SpinnerComponent
  ],
  template: `
    <app-spinner></app-spinner>
    <app-toast-container></app-toast-container>

    <ng-container *ngIf="isAuthPage; else adminLayout">
      <router-outlet></router-outlet>
    </ng-container>

    <ng-template #adminLayout>
      <div class="admin-layout">
        <app-sidebar [collapsed]="sidebarCollapsed" (toggleCollapse)="sidebarCollapsed = !sidebarCollapsed"></app-sidebar>
        <div class="admin-content" [class.sidebar-collapsed]="sidebarCollapsed">
          <app-navbar [sidebarCollapsed]="sidebarCollapsed" (toggleSidebar)="sidebarCollapsed = !sidebarCollapsed"></app-navbar>
          <div class="page-container">
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>
    </ng-template>
  `
})
export class App implements OnInit {
  sidebarCollapsed = false;
  isAuthPage = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.isAuthPage = e.url.startsWith('/auth');
    });
    this.isAuthPage = this.router.url.startsWith('/auth');
  }
}
