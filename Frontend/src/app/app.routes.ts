import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public website routes
  {
    path: '',
    loadComponent: () => import('./website/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./website/about-page/about-page.component').then(m => m.AboutPageComponent)
  },
  {
    path: 'services',
    loadComponent: () => import('./website/services-page/services-page.component').then(m => m.ServicesPageComponent)
  },
  {
    path: 'services/:id',
    loadComponent: () => import('./website/service-detail/service-detail.component').then(m => m.ServiceDetailComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('./website/projects-page/projects-page.component').then(m => m.ProjectsPageComponent)
  },
  {
    path: 'projects/:id',
    loadComponent: () => import('./website/project-detail/project-detail.component').then(m => m.ProjectDetailComponent)
  },
  {
    path: 'gallery',
    loadComponent: () => import('./website/gallery-page/gallery-page.component').then(m => m.GalleryPageComponent)
  },
  {
    path: 'team',
    loadComponent: () => import('./website/team-page/team-page.component').then(m => m.TeamPageComponent)
  },
  {
    path: 'blogs',
    loadComponent: () => import('./website/blogs-page/blogs-page.component').then(m => m.BlogsPageComponent)
  },
  {
    path: 'blogs/:id',
    loadComponent: () => import('./website/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./website/contact-page/contact-page.component').then(m => m.ContactPageComponent)
  },
  
  // Admin routes
  {
    path: 'admin',
    children: [
      // Admin login
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./admin/auth/login/login.component').then(m => m.LoginComponent)
      },
      // Admin dashboard and modules
      {
        path: '',
        loadComponent: () => import('./admin/shared/layout/layout.component').then(m => m.LayoutComponent),
        canActivate: [authGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          {
            path: 'dashboard',
            loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
          },
          {
            path: 'projects',
            loadComponent: () => import('./admin/projects/projects-list/projects-list.component').then(m => m.ProjectsListComponent)
          },
          {
            path: 'projects/new',
            loadComponent: () => import('./admin/projects/project-form/project-form.component').then(m => m.ProjectFormComponent)
          },
          {
            path: 'projects/:id/edit',
            loadComponent: () => import('./admin/projects/project-form/project-form.component').then(m => m.ProjectFormComponent)
          },
          {
            path: 'services',
            loadComponent: () => import('./admin/services/services-list/services-list.component').then(m => m.ServicesListComponent)
          },
          {
            path: 'services/new',
            loadComponent: () => import('./admin/services/service-form/service-form.component').then(m => m.ServiceFormComponent)
          },
          {
            path: 'services/:id/edit',
            loadComponent: () => import('./admin/services/service-form/service-form.component').then(m => m.ServiceFormComponent)
          },
          {
            path: 'gallery',
            loadComponent: () => import('./admin/gallery/gallery.component').then(m => m.GalleryComponent)
          },
          {
            path: 'media',
            loadComponent: () => import('./admin/media/media.component').then(m => m.MediaComponent)
          },
          {
            path: 'posts',
            loadComponent: () => import('./admin/posts/posts-list/posts-list.component').then(m => m.PostsListComponent)
          },
          {
            path: 'posts/new',
            loadComponent: () => import('./admin/posts/post-form/post-form.component').then(m => m.PostFormComponent)
          },
          {
            path: 'posts/:id/edit',
            loadComponent: () => import('./admin/posts/post-form/post-form.component').then(m => m.PostFormComponent)
          },
          {
            path: 'team',
            loadComponent: () => import('./admin/team/team.component').then(m => m.TeamComponent)
          },
          {
            path: 'clients',
            loadComponent: () => import('./admin/clients/clients.component').then(m => m.ClientsComponent)
          },
          {
            path: 'reviews',
            loadComponent: () => import('./admin/reviews/reviews.component').then(m => m.ReviewsComponent)
          },
          {
            path: 'faqs',
            loadComponent: () => import('./admin/faqs/faqs.component').then(m => m.FaqsComponent)
          },
          {
            path: 'about',
            loadComponent: () => import('./admin/about/about.component').then(m => m.AboutComponent)
          },
          {
            path: 'statistics',
            loadComponent: () => import('./admin/statistics/statistics.component').then(m => m.StatisticsComponent)
          },
          {
            path: 'messages',
            loadComponent: () => import('./admin/messages/messages.component').then(m => m.MessagesComponent)
          },
          {
            path: 'settings',
            loadComponent: () => import('./admin/settings/settings.component').then(m => m.SettingsComponent)
          }
        ]
      }
    ]
  },
  
  // Fallback redirect to home
  { path: '**', redirectTo: '' }
];
