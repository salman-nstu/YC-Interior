import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './components/hero/hero.component';
import { StaticSectionComponent } from './components/static-section/static-section.component';
import { AboutComponent } from './components/about/about.component';
import { ServicesComponent } from './components/services/services.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { StatsComponent } from './components/stats/stats.component';
import { FaqComponent } from './components/faq/faq.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    StaticSectionComponent,
    AboutComponent,
    ServicesComponent,
    ProjectsComponent,
    GalleryComponent,
    StatsComponent,
    FaqComponent,
    ClientsComponent,
    ReviewsComponent,
    FooterComponent
  ],
  template: `
    <app-hero />
    <app-static-section />
    <app-about />
    <app-services />
    <app-projects />
    <app-gallery />
    <app-stats />
    <app-faq />
    <app-clients />
    <app-reviews />
    <app-footer />
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HomeComponent {}
