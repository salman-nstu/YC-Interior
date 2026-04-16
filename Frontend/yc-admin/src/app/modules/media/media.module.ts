import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MediaListComponent } from './media-list/media-list.component';

@NgModule({
  imports: [CommonModule, MediaListComponent, RouterModule.forChild([{ path: '', component: MediaListComponent }])]
})
export class MediaModule {}
