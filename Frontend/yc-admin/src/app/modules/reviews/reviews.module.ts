import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReviewsComponent } from './reviews.component';

@NgModule({
  imports: [CommonModule, ReviewsComponent, RouterModule.forChild([{ path: '', component: ReviewsComponent }])]
})
export class ReviewsModule {}
