import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GalleryListComponent } from './gallery-list/gallery-list.component';
import { GalleryFormComponent } from './gallery-form/gallery-form.component';

@NgModule({
  imports: [CommonModule, GalleryListComponent, GalleryFormComponent, RouterModule.forChild([
    { path: '', component: GalleryListComponent },
    { path: 'new', component: GalleryFormComponent },
    { path: 'edit/:id', component: GalleryFormComponent }
  ])]
})
export class GalleryModule {}
