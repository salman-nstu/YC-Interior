import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MediaListComponent } from './media-list/media-list.component';

@NgModule({
  declarations: [MediaListComponent],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: MediaListComponent }])]
})
export class MediaModule {}
