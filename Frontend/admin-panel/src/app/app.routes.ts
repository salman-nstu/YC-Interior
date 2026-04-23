import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/layout/layout.component';

export const routes: Routes = [
  // Redirect root to admin
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  
  // Admin routes
  {
    path: 'admin',
    children: [
      // Admin login
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent)
      },
      // Admin dashboard and modules
      {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          {
            path: 'dashboard',
            loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent)
          },
          {
            path: 'projects',
            loadComponent: () => import('./modules/projects/projects-list/projects-list.component').then(m => m.ProjectsListComponent)
          },
          {
            path: 'projects/new',
            loadComponent: () => import('./modules/projects/project-form/project-form.component').then(m => m.ProjectFormComponent)
          },
          {
            path: 'projects/:id/edit',
            loadComponent: () => import('./modules/projects/project-form/project-form.component').then(m => m.ProjectFormComponent)
          },
          {
            path: 'services',
            loadComponent: () => import('./modules/services/services-list/services-list.component').then(m => m.ServicesListComponent)
          },
          {
            path: 'services/new',
            loadComponent: () => import('./modules/services/service-form/service-form.component').then(m => m.ServiceFormComponent)
          },
          {
            path: 'services/:id/edit',
            loadComponent: () => import('./modules/services/service-form/service-form.component').then(m => m.ServiceFormComponent)
          },
          {
            path: 'gallery',
            loadComponent: () => import('./modules/gallery/gallery.component').then(m => m.GalleryComponent)
          },
          {
            path: 'media',
            loadComponent: () => import('./modules/media/media.component').then(m => m.MediaComponent)
          },
          {
            path: 'posts',
            loadComponent: () => import('./modules/posts/posts-list/posts-list.component').then(m => m.PostsListComponent)
          },
          {
            path: 'posts/new',
            loadComponent: () => import('./modules/posts/post-form/post-form.component').then(m => m.PostFormComponent)
          },
          {
            path: 'posts/:id/edit',
            loadComponent: () => import('./modules/posts/post-form/post-form.component').then(m => m.PostFormComponent)
          },
          {
            path: 'team',
            loadComponent: () => import('./modules/team/team.component').then(m => m.TeamComponent)
          },
          {
            path: 'clients',
            loadComponent: () => import('./modules/clients/clients.component').then(m => m.ClientsComponent)
          },
          {
            path: 'reviews',
            loadComponent: () => import('./modules/reviews/reviews.component').then(m => m.ReviewsComponent)
          },
          {
            path: 'faqs',
            loadComponent: () => import('./modules/faqs/faqs.component').then(m => m.FaqsComponent)
          },
          {
            path: 'about',
            loadComponent: () => import('./modules/about/about.component').then(m => m.AboutComponent)
          },
          {
            path: 'statistics',
            loadComponent: () => import('./modules/statistics/statistics.component').then(m => m.StatisticsComponent)
          },
          {
            path: 'messages',
            loadComponent: () => import('./modules/messages/messages.component').then(m => m.MessagesComponent)
          },
          {
            path: 'settings',
            loadComponent: () => import('./modules/settings/settings.component').then(m => m.SettingsComponent)
          }
        ]
      }
    ]
  },
  // Fallback redirect
  { path: '**', redirectTo: '/admin' }
];
