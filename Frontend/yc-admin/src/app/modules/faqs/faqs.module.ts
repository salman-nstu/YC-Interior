import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FaqsComponent } from './faqs.component';

@NgModule({
  declarations: [FaqsComponent],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: FaqsComponent }])]
})
export class FaqsModule {}
