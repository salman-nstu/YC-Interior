import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TeamComponent } from './team.component';

@NgModule({
  declarations: [TeamComponent],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: TeamComponent }])]
})
export class TeamModule {}
