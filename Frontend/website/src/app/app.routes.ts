import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { ServicesPageComponent } from './services-page/services-page.component';
import { ProjectsPageComponent } from './projects-page/projects-page.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { GalleryPageComponent } from './gallery-page/gallery-page.component';
import { TeamPageComponent } from './team-page/team-page.component';
import { BlogsPageComponent } from './blogs-page/blogs-page.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { ContactPageComponent } from './contact-page/contact-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'services', component: ServicesPageComponent },
  { path: 'services/:id', component: ServiceDetailComponent },
  { path: 'projects', component: ProjectsPageComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },
  { path: 'gallery', component: GalleryPageComponent },
  { path: 'team', component: TeamPageComponent },
  { path: 'blogs', component: BlogsPageComponent },
  { path: 'blogs/:id', component: BlogDetailComponent },
  { path: 'contact', component: ContactPageComponent },
  { path: '**', redirectTo: '' }
];
