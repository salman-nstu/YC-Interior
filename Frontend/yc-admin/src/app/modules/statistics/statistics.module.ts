import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { StatisticsComponent } from './statistics.component';

@NgModule({
  declarations: [StatisticsComponent],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: StatisticsComponent }])]
})
export class StatisticsModule {}
