import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { GalleryListComponent } from './gallery-list/gallery-list.component';
import { GalleryFormComponent } from './gallery-form/gallery-form.component';

@NgModule({
  declarations: [GalleryListComponent, GalleryFormComponent],
  imports: [SharedModule, RouterModule.forChild([
    { path: '', component: GalleryListComponent },
    { path: 'new', component: GalleryFormComponent },
    { path: 'edit/:id', component: GalleryFormComponent }
  ])]
})
export class GalleryModule {}
