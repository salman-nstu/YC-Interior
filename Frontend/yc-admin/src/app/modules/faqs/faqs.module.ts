import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FaqsComponent } from './faqs.component';

@NgModule({
  imports: [CommonModule, FaqsComponent, RouterModule.forChild([{ path: '', component: FaqsComponent }])]
})
export class FaqsModule {}
