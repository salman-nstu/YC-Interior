import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AboutListComponent } from './about-list/about-list.component';

@NgModule({
  imports: [CommonModule, AboutListComponent, RouterModule.forChild([{ path: '', component: AboutListComponent }])]
})
export class AboutModule {}
