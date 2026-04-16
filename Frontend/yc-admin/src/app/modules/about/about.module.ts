import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AboutListComponent } from './about-list/about-list.component';

@NgModule({
  declarations: [AboutListComponent],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: AboutListComponent }])]
})
export class AboutModule {}
