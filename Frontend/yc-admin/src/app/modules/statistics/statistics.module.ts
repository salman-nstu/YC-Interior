import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatisticsComponent } from './statistics.component';

@NgModule({
  imports: [CommonModule, StatisticsComponent, RouterModule.forChild([{ path: '', component: StatisticsComponent }])]
})
export class StatisticsModule {}
